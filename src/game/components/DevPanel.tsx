import { memo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { BASE, RADIUS } from '@/constants/theme';
import { playSfx } from '@/game/audio/audio';
import { useGameStore } from '@/game/store/gameStore';
import { clearSavedGame } from '@/game/lib/persistence';

type DevPanelProps = {
  visible: boolean;
  onClose: () => void;
};

export const DevPanel = memo(function DevPanel({ visible, onClose }: DevPanelProps) {
  const godMode = useGameStore((s) => s.godMode);
  const toggleGodMode = useGameStore((s) => s.toggleGodMode);
  const devAddEssence = useGameStore((s) => s.devAddEssence);
  const devAddQuintessence = useGameStore((s) => s.devAddQuintessence);
  const triggerAstralEvent = useGameStore((s) => s.triggerAstralEvent);
  const devResetSave = useGameStore((s) => s.devResetSave);

  const [busy, setBusy] = useState(false);

  if (!__DEV__) return null;

  const handleReset = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await clearSavedGame();
      devResetSave();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.panel} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>DEV PANEL</Text>

          <Pressable
            style={[styles.btn, godMode && styles.btnActive]}
            onPress={() => toggleGodMode()}>
            <Text style={styles.btnTxt}>God Mode: {godMode ? 'ON' : 'OFF'}</Text>
          </Pressable>

          <Pressable style={styles.btn} onPress={() => devAddEssence(1e12)}>
            <Text style={styles.btnTxt}>+1e12 Essência</Text>
          </Pressable>

          <Pressable style={styles.btn} onPress={() => devAddEssence(1e18)}>
            <Text style={styles.btnTxt}>+1e18 Essência</Text>
          </Pressable>

          <Pressable style={styles.btn} onPress={() => devAddQuintessence(50)}>
            <Text style={styles.btnTxt}>+50 Quintessência</Text>
          </Pressable>

          <Pressable
            style={styles.btn}
            onPress={() => {
              const event = triggerAstralEvent();
              playSfx('conjuncao');
              if (event.apply === 'lucky') playSfx('sorte');
            }}>
            <Text style={styles.btnTxt}>Forçar Evento</Text>
          </Pressable>

          <Pressable style={[styles.btn, styles.btnDanger]} onPress={() => void handleReset()}>
            <Text style={styles.btnTxt}>{busy ? 'Resetando…' : 'Resetar save'}</Text>
          </Pressable>

          <Pressable style={styles.close} onPress={onClose}>
            <Text style={styles.closeTxt}>Fechar</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: 24,
  },
  panel: {
    backgroundColor: BASE.bgElevated,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: BASE.gold,
    padding: 16,
    gap: 8,
  },
  title: {
    color: BASE.gold,
    fontFamily: 'Cinzel_700Bold',
    fontSize: 16,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 4,
  },
  btn: {
    backgroundColor: BASE.bgSurface,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BASE.borderHair,
  },
  btnActive: {
    borderColor: BASE.gold,
    backgroundColor: '#2A2418',
  },
  btnDanger: {
    borderColor: BASE.danger,
  },
  btnTxt: {
    color: BASE.textPrimary,
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 13,
    textAlign: 'center',
  },
  close: {
    marginTop: 4,
    paddingVertical: 8,
  },
  closeTxt: {
    color: BASE.textMuted,
    textAlign: 'center',
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 12,
  },
});
