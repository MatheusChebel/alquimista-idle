import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  BASE,
  PHASE_DISPLAY_NAMES,
  PHASE_MILESTONES,
  Radius,
  Spacing,
  TypeScale,
  getPhaseForQuintessence,
  tabularNums,
} from '@/constants/theme';
import { QUINTESSENCE_NODES } from '@/game/data/quintessence';
import { usePhaseTheme } from '@/game/hooks/usePhaseTheme';
import { formatNumber } from '@/game/lib/formulas';
import {
  calculatePrestigeGain,
  canPrestige,
  getPrestigeMult,
} from '@/game/lib/prestige';
import { useGameStore } from '@/game/store/gameStore';

import { GrandeObraWheel } from '@/game/components/prestige/GrandeObraWheel';

function QuintessenceTree() {
  const essence = useGameStore((state) => state.quintessence);
  const boughtPermNodes = useGameStore((state) => state.boughtPermNodes);
  const buyQuintessenceNode = useGameStore((state) => state.buyQuintessenceNode);
  const theme = usePhaseTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.accent }]}>Árvore da Quintessência</Text>
      <Text style={[styles.hint, { color: BASE.textMuted }]}>
        Saldo: ✦ {formatNumber(essence)} quintessência
      </Text>
      {QUINTESSENCE_NODES.map((node) => {
        const owned = boughtPermNodes[node.id];
        const canBuy = !owned && essence >= node.cost;

        return (
          <Pressable
            key={node.id}
            disabled={owned || !canBuy}
            onPress={() => buyQuintessenceNode(node.id)}
            style={[
              styles.nodeRow,
              {
                backgroundColor: owned ? BASE.bgElevated : BASE.bgSurface,
                borderColor: canBuy ? BASE.gold : BASE.borderHair,
                opacity: owned ? 0.6 : 1,
              },
            ]}>
            <View style={styles.nodeInfo}>
              <Text style={[styles.nodeName, { color: BASE.textPrimary }]}>{node.displayName}</Text>
              <Text style={[styles.nodeDesc, { color: BASE.textMuted }]}>{node.description}</Text>
            </View>
            <Text
              style={[
                styles.nodeCost,
                tabularNums,
                { color: owned ? BASE.textFaint : canBuy ? BASE.gold : BASE.danger },
              ]}>
              {owned ? '✓' : `✦ ${node.cost}`}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function MagnumOpusRoot() {
  const visible = useGameStore((state) => state.magnumOpusOpen);
  const closeMagnumOpus = useGameStore((state) => state.closeMagnumOpus);
  const theme = usePhaseTheme();

  const totalEssenceEarned = useGameStore((state) => state.totalEssenceEarned);
  const prestigePoints = useGameStore((state) => state.prestigePoints);
  const quintessenceEarned = useGameStore((state) => state.quintessenceEarned);
  const prestige = useGameStore((state) => state.prestige);

  const gain = calculatePrestigeGain(totalEssenceEarned, prestigePoints);
  const mayPrestige = canPrestige(totalEssenceEarned, prestigePoints);
  const currentPhase = getPhaseForQuintessence(quintessenceEarned);

  const handlePrestige = () => {
    Alert.alert(
      'Magnum Opus',
      `Transmutar a Obra e ganhar +${gain} quintessência?\n\n` +
        `Bônus global: ×${getPrestigeMult(prestigePoints + gain).toFixed(2)}\n\n` +
        'Sua run será resetada. Conquistas e nós permanentes permanecem.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Transmutar',
          style: 'destructive',
          onPress: () => {
            if (prestige()) closeMagnumOpus();
          },
        },
      ],
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={closeMagnumOpus}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: BASE.bgSurface, borderColor: theme.accent }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.title, { color: theme.accent }]}>MAGNUM OPUS</Text>
            <Text style={[styles.subtitle, { color: BASE.textMuted }]}>
              Fase atual: {PHASE_DISPLAY_NAMES[currentPhase]}
            </Text>
            <GrandeObraWheel size={180} showCenter />

            {mayPrestige ? (
              <Pressable
                onPress={handlePrestige}
                style={[styles.prestigeButton, { borderColor: theme.glow, backgroundColor: BASE.bgElevated }]}>
                <Text style={[styles.prestigeTitle, { color: theme.essence }]}>
                  Prestigiar (+{gain} ✦)
                </Text>
                <Text style={[styles.prestigeHint, { color: BASE.textMuted }]}>
                  Bônus permanente +{gain}% produção global
                </Text>
              </Pressable>
            ) : (
              <Text style={[styles.hint, { color: BASE.textFaint }]}>
                Próximo ganho: precisa de mais essência total acumulada.
              </Text>
            )}

            <View style={styles.statsRow}>
              <Text style={[styles.stat, tabularNums, { color: BASE.textMuted }]}>
                Pontos: {prestigePoints}
              </Text>
              <Text style={[styles.stat, tabularNums, { color: BASE.textMuted }]}>
                Total ✦: {formatNumber(quintessenceEarned)}
              </Text>
            </View>

            <Text style={[styles.milestoneHint, { color: BASE.textFaint }]}>
              Marcos: Albedo {PHASE_MILESTONES.albedo} · Citrinitas {PHASE_MILESTONES.citrinitas} · Rubedo{' '}
              {PHASE_MILESTONES.rubedo}
            </Text>

            <QuintessenceTree />
          </ScrollView>

          <Pressable onPress={closeMagnumOpus} style={[styles.closeButton, { borderColor: BASE.borderHair }]}>
            <Text style={{ color: BASE.textPrimary }}>Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export function MagnumOpusFab() {
  const theme = usePhaseTheme();
  const openMagnumOpus = useGameStore((state) => state.openMagnumOpus);
  const totalEssenceEarned = useGameStore((state) => state.totalEssenceEarned);
  const prestigePoints = useGameStore((state) => state.prestigePoints);

  if (!canPrestige(totalEssenceEarned, prestigePoints)) return null;

  const gain = calculatePrestigeGain(totalEssenceEarned, prestigePoints);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={openMagnumOpus}
      style={[styles.fab, { backgroundColor: BASE.bgElevated, borderColor: theme.glow }]}>
      <Text style={[styles.fabText, { color: theme.essence }]}>✦ Magnum Opus (+{gain})</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: Spacing.three,
  },
  modal: {
    maxHeight: '85%',
    borderRadius: Radius.card,
    borderWidth: 2,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  title: {
    ...TypeScale.tabTitle,
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
  },
  phaseMeter: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.two,
    marginVertical: Spacing.two,
  },
  phaseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  prestigeButton: {
    borderRadius: Radius.card,
    borderWidth: 2,
    padding: Spacing.three,
    marginVertical: Spacing.two,
    alignItems: 'center',
  },
  prestigeTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  prestigeHint: {
    fontSize: 12,
    marginTop: 4,
  },
  hint: {
    textAlign: 'center',
    fontSize: 13,
    fontStyle: 'italic',
    marginVertical: Spacing.two,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.one,
  },
  stat: {
    fontSize: 13,
  },
  milestoneHint: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: Spacing.three,
  },
  section: {
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: Spacing.two,
  },
  nodeInfo: {
    flex: 1,
    gap: 2,
  },
  nodeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  nodeDesc: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  nodeCost: {
    fontSize: 15,
    fontWeight: '700',
  },
  closeButton: {
    marginTop: Spacing.two,
    padding: Spacing.two,
    borderRadius: Radius.card,
    borderWidth: 1,
    alignItems: 'center',
  },
  fab: {
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderWidth: 2,
    marginBottom: Spacing.two,
  },
  fabText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
