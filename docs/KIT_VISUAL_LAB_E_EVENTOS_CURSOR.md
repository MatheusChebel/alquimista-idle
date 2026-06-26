# Kit Visual — Laboratório & Eventos (código pronto)

> Addendum do `KIT_VISUAL_CURSOR.md`. Estes componentes **reutilizam** `Sigil`/`ItemIcon`,
> os tokens de `theme.ts` e os mesmos ícones Tabler — então nascem idênticos ao estilo dos
> mockups. Performance embutida (Reanimated v4, só `transform`/`opacity`, tetos, pausa offscreen).

---

## 1. Dados de nível do Laboratório — `src/game/data/labTiers.ts`
```ts
import { PHASE, BASE, type Phase } from "../../constants/theme";

export const MAX_SHELF_SPRITES = 6;           // teto de sprites por estação

export function visualTier(owned: number): 0|1|2|3|4|5 {
  if (owned <= 0)  return 0;                   // travada
  if (owned < 5)   return 1;
  if (owned < 25)  return 2;
  if (owned < 50)  return 3;
  if (owned < 100) return 4;
  return 5;                                     // mestre
}

const TIER_TOKEN: Record<number, "essence"|"accent"|"gold"> =
  { 1:"essence", 2:"essence", 3:"accent", 4:"gold", 5:"gold" };

export function tierTint(tier: number, phase: Phase): string {
  const tok = TIER_TOKEN[tier] ?? "essence";
  if (tok === "gold") return BASE.gold;
  return tok === "accent" ? PHASE[phase].accent : PHASE[phase].essence;
}
```

---

## 2. Prateleira da estação — `src/game/components/lab/StationShelf.tsx`
Mostra até 6 sprites (resto vira `+K`); **só o 1º anima** (sprite representante), respeitando o teto de animação.
```tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated";
import { ICONS } from "../Sigil";
import { BASE, RADIUS } from "../../../constants/theme";
import { MAX_SHELF_SPRITES } from "../../data/labTiers";

function AmbientSprite({ Glyph, color, animated }:{ Glyph:any; color:string; animated:boolean }) {
  const y = useSharedValue(0);
  React.useEffect(() => {
    if (animated) y.value = withRepeat(withTiming(-3, { duration: 1400, easing: Easing.inOut(Easing.sin) }), -1, true);
    else y.value = 0;
  }, [animated]);
  const st = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return <Animated.View style={st}><Glyph size={16} color={color} stroke={1.8} /></Animated.View>;
}

export function StationShelf({ id, owned, tint, animated }:{
  id:string; owned:number; tint:string; animated:boolean;
}) {
  const Glyph = ICONS[id];
  if (!Glyph) return null;
  const shown = Math.min(owned, MAX_SHELF_SPRITES);
  const extra = owned - shown;
  return (
    <View style={styles.shelf}>
      {Array.from({ length: shown }).map((_, i) =>
        i === 0
          ? <AmbientSprite key={i} Glyph={Glyph} color={tint} animated={animated} />
          : <Glyph key={i} size={16} color={tint} stroke={1.8} />
      )}
      {extra > 0 && <Text style={styles.extra}>+{extra}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  shelf: { flexDirection: "row", alignItems: "center", gap: 6,
           backgroundColor: BASE.bgDeep, borderRadius: 9, paddingVertical: 7, paddingHorizontal: 8 },
  extra: { fontSize: 11, color: BASE.textMuted, marginLeft: 3, fontFamily: "SpaceGrotesk_500Medium" },
});
```

---

## 3. A estação — `src/game/components/lab/LabStation.tsx`
```tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconLock } from "@tabler/icons-react-native";
import { ItemIcon } from "../Sigil";
import { StationShelf } from "./StationShelf";
import { BASE, RADIUS, type Phase } from "../../../constants/theme";
import { visualTier, tierTint } from "../../data/labTiers";

export const LabStation = React.memo(function LabStation({ id, name, owned, epsLabel, phase, animated }:{
  id:string; name:string; owned:number; epsLabel:string; phase:Phase; animated:boolean;
}) {
  const tier = visualTier(owned);
  const tint = tierTint(tier, phase);
  const goldBadge = tier >= 4;
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ItemIcon id={id} ringColor={tint} size={30} />
        <Text style={styles.name} numberOfLines={1}>
          {name} <Text style={styles.count}>×{owned}</Text>
        </Text>
        <View style={[styles.badge, goldBadge ? styles.badgeGold : styles.badgeMuted]}>
          <Text style={[styles.badgeTxt, { color: goldBadge ? BASE.goldInk : BASE.textMuted }]}>NÍVEL {tier}</Text>
        </View>
      </View>
      <StationShelf id={id} owned={owned} tint={tint} animated={animated} />
      <Text style={styles.eps}>{epsLabel}</Text>
    </View>
  );
});

/** Teaser da próxima estação (estilo fantasma) */
export function LockedStation({ hint }:{ hint:string }) {
  return (
    <View style={[styles.card, styles.locked]}>
      <View style={[styles.lockSigil]}><IconLock size={15} color={BASE.textFaint} stroke={1.8} /></View>
      <Text style={styles.lockTxt}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: BASE.bgSurface, borderRadius: RADIUS.card,
          borderWidth: StyleSheet.hairlineWidth, borderColor: BASE.borderHair,
          paddingVertical: 10, paddingHorizontal: 11, marginBottom: 9 },
  header: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  name: { flex: 1, fontSize: 14, color: BASE.textPrimary, fontFamily: "CormorantGaramond_600SemiBold" },
  count: { fontSize: 12, color: BASE.textMuted, fontFamily: "SpaceGrotesk_500Medium" },
  badge: { borderRadius: 6, paddingVertical: 2, paddingHorizontal: 7 },
  badgeGold: { backgroundColor: BASE.gold },
  badgeMuted:{ backgroundColor: BASE.bgElevated },
  badgeTxt: { fontSize: 10, letterSpacing: 0.5, fontFamily: "SpaceGrotesk_500Medium" },
  eps: { marginTop: 6, fontSize: 11, color: BASE.textMuted, fontFamily: "SpaceGrotesk_500Medium", fontVariant: ["tabular-nums"] },
  // travada
  locked: { borderStyle: "dashed", borderColor: "#2A2440", backgroundColor: "#140F1F",
            flexDirection: "row", alignItems: "center", gap: 9, opacity: 0.6 },
  lockSigil: { width: 30, height: 30, borderRadius: 15, backgroundColor: BASE.bgSurface,
               borderWidth: StyleSheet.hairlineWidth, borderColor: "#2A2440",
               alignItems: "center", justifyContent: "center" },
  lockTxt: { flex: 1, fontSize: 13, color: BASE.textFaint, fontFamily: "CormorantGaramond_600SemiBold" },
});
```

### Tela do Laboratório — `src/game/components/lab/LabScreen.tsx` (esqueleto)
```tsx
// Pausa o ambiente quando a aba não está focada (performance):
import { useIsFocused } from "@react-navigation/native"; // ou useFocusEffect do expo-router
// const focused = useIsFocused();
// const animated = focused && !calmMode;   // calmMode = Reduzir Movimento / economia
//
// Renderize SÓ estações com owned>0 (selector do store) + UMA <LockedStation hint="..."/>:
// <ScrollView>
//   {unlocked.map(g => <LabStation key={g.id} id={g.id} name={g.displayName}
//        owned={owned[g.id]} epsLabel={`+${fmt(eps[g.id])} /seg`} phase={phase} animated={animated} />)}
//   {nextLocked && <LockedStation hint={`${nextLocked.displayName} — compre 1 para revelar a estação`} />}
// </ScrollView>
```

---

## 4. Eventos: config visual — `src/game/data/eventVisuals.ts`
```ts
import { IconFlame, IconHandFinger, IconMoon } from "@tabler/icons-react-native";

export const EVENT_VISUALS = {
  frenzy:      { name: "FRENESI",       multLabel: "produção ×7",   color: "#FF9A5C", bg: "#1C1208", Icon: IconFlame },
  clickFrenzy: { name: "TOQUE DOURADO", multLabel: "toque ×777",    color: "#F5C542", bg: "#1A1606", Icon: IconHandFinger },
  eclipse:     { name: "ECLIPSE",       multLabel: "produção ×0,5", color: "#B0506E", bg: "#180B12", Icon: IconMoon },
} as const;
export type TimedEventId = keyof typeof EVENT_VISUALS;
// "lucky" (Sorte) é instantâneo → usa LuckyPopup, não o banner.
```

## 5. Banner com timer — `src/game/components/event/EventBanner.tsx`
Barra encolhe por `scaleX` ancorado à esquerda (transform = barato); texto `M:SS` a 4 Hz; pisca nos últimos 3s.
```tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from "react-native-reanimated";
import { BASE, RADIUS } from "../../../constants/theme";
import { EVENT_VISUALS, type TimedEventId } from "../../data/eventVisuals";

function useRemaining(endsAt:number){
  const [ms,setMs]=React.useState(Math.max(0,endsAt-Date.now()));
  React.useEffect(()=>{ const t=setInterval(()=>setMs(Math.max(0,endsAt-Date.now())),250); return ()=>clearInterval(t); },[endsAt]);
  return ms;
}
const fmt=(ms:number)=>{ const s=Math.ceil(ms/1000); return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`; };

export function EventBanner({ eventId, endsAt, durationMs }:{
  eventId:TimedEventId; endsAt:number; durationMs:number;
}) {
  const v = EVENT_VISUALS[eventId];
  const remaining = useRemaining(endsAt);
  const ending = remaining <= 3000 && remaining > 0;

  const intro = useSharedValue(0);
  React.useEffect(()=>{ intro.value = withTiming(1,{duration:250}); },[]);
  const introStyle = useAnimatedStyle(()=>({ opacity: intro.value, transform:[{ translateY:(1-intro.value)*-16 }] }));

  const p = useSharedValue(Math.max(0,(endsAt-Date.now())/durationMs));
  React.useEffect(()=>{ const rem=Math.max(0,endsAt-Date.now()); p.value = withTiming(0,{duration:rem, easing:Easing.linear}); },[endsAt]);
  const fillStyle = useAnimatedStyle(()=>({ transform:[{ scaleX: Math.max(0,p.value) }] }));

  const pulse = useSharedValue(1);
  React.useEffect(()=>{
    if (ending) pulse.value = withRepeat(withTiming(0.4,{duration:400}),-1,true);
    else pulse.value = withTiming(1,{duration:150});
  },[ending]);
  const pulseStyle = useAnimatedStyle(()=>({ opacity: pulse.value }));

  const Icon = v.Icon;
  return (
    <Animated.View style={[styles.banner,{ backgroundColor:v.bg, borderColor:v.color }, introStyle]}>
      <View style={styles.row}>
        <View style={[styles.iconWrap,{ backgroundColor:v.color+"2E" }]}><Icon size={16} color={v.color} stroke={1.8} /></View>
        <Text style={[styles.name,{ color:v.color }]} numberOfLines={1}>
          {v.name} <Text style={styles.mult}>· {v.multLabel}</Text>
        </Text>
        <Animated.Text style={[styles.time,{ color:v.color }, pulseStyle]}>{fmt(remaining)}</Animated.Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill,{ backgroundColor:v.color }, fillStyle, pulseStyle]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: { borderRadius: RADIUS.card, borderWidth: StyleSheet.hairlineWidth, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 11 },
  row: { flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 8 },
  iconWrap: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  name: { flex: 1, fontSize: 14, letterSpacing: 1, fontFamily: "Cinzel_700Bold" },
  mult: { color: BASE.textMuted, letterSpacing: 0, fontFamily: "SpaceGrotesk_500Medium", fontSize: 12 },
  time: { fontSize: 13, fontFamily: "SpaceGrotesk_500Medium", fontVariant: ["tabular-nums"] },
  track: { height: 5, backgroundColor: BASE.bgElevated, borderRadius: 3, overflow: "hidden" },
  fill: { height: "100%", width: "100%", borderRadius: 3, transformOrigin: "left" },
});
```

## 6. Sorte (instantâneo) — `src/game/components/event/LuckyPopup.tsx`
```tsx
import React from "react";
import { Text, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from "react-native-reanimated";
import { BASE } from "../../../constants/theme";

export function LuckyPopup({ amountLabel, onDone }:{ amountLabel:string; onDone:()=>void }) {
  const s = useSharedValue(0.6); const o = useSharedValue(0);
  React.useEffect(()=>{
    s.value = withSequence(withTiming(1.05,{duration:180}), withTiming(1,{duration:120}));
    o.value = withSequence(withTiming(1,{duration:160}), withTiming(1,{duration:1000}), withTiming(0,{duration:300}));
    const t = setTimeout(onDone, 1600); return ()=>clearTimeout(t);
  },[]);
  const st = useAnimatedStyle(()=>({ opacity:o.value, transform:[{ scale:s.value }] }));
  return (
    <Animated.View pointerEvents="none" style={[styles.box, st]}>
      <Text style={styles.title}>✦ SORTE! ✦</Text>
      <Text style={styles.amount}>+{amountLabel} essência</Text>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  box: { position:"absolute", alignSelf:"center", top:"38%", backgroundColor:"#1A1606",
         borderColor:BASE.gold, borderWidth:1, borderRadius:14, paddingVertical:14, paddingHorizontal:18, alignItems:"center" },
  title: { fontSize:15, letterSpacing:2, color:"#FFE08A", fontFamily:"Cinzel_700Bold", marginBottom:3 },
  amount:{ fontSize:20, color:BASE.textPrimary, fontFamily:"SpaceGrotesk_600SemiBold", fontVariant:["tabular-nums"] },
});
```

## 7. Vinheta de evento (ambiente leve) — `EventOverlay.tsx`
1 `View` absoluto com a cor do evento em baixa opacidade, animada na entrada/saída (barato, sem shader):
```tsx
// <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill,
//   { backgroundColor: v.color, opacity }]} />   // opacity ~0.06, anima 0→0.06 no início
// Frenesi: anime opacity num leve loop 0.05↔0.09 (pulsa). Eclipse: cor violeta, opacity ~0.12 (escurece).
// Polimento opcional: vinheta radial de verdade via react-native-svg <RadialGradient>.
```

---

## 8. Como ligar no jogo (store → UI)
```tsx
// store: activeEvent: { id, endsAt, mult, durationMs } | null
// Na tela da Poção (topo, abaixo do contador):
//   {activeEvent && activeEvent.id !== "lucky" &&
//     <EventBanner eventId={activeEvent.id} endsAt={activeEvent.endsAt} durationMs={activeEvent.durationMs} />}
//   {luckyAmount && <LuckyPopup amountLabel={luckyAmount} onDone={clearLucky} />}
// Laboratório: animated = abaFocada && !calmMode (pausa quando sai da aba).
```

## 9. Aceite
- [ ] Estação aparece ao comprar, sobe de NÍVEL nos marcos, mostra `×N`/`+K`, só 1 sprite anima.
- [ ] Estação travada aparece como teaser fantasma (cadeado), não as 9.
- [ ] Banner por evento com ícone Tabler + nome (Cinzel) + `M:SS`; barra encolhe e pisca nos últimos 3s.
- [ ] Sorte = popup central que some sozinho.
- [ ] Tudo reusa `Sigil`/`ItemIcon`/tokens → idêntico ao estilo dos mockups.
- [ ] Animações pausam fora da aba / em modo calmo.
