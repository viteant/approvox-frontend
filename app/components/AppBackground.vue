<template>
  <div class="fixed inset-0 -z-10 overflow-hidden bg-white dark:bg-[#0B1120] transition-colors duration-700">
    <div class="absolute inset-0 filter blur-[110px] saturate-150 contrast-125 opacity-70 dark:opacity-30">

      <div class="absolute top-[-10%] left-[-15%] w-[80vw] h-[80vw] rounded-full
                  bg-blue-100/30 mix-blend-multiply dark:mix-blend-soft-light
                  animate-chaos-1 dark:bg-blue-600/30" />

      <div class="absolute top-[20%] right-[-10%] w-[70vw] h-[70vw] rounded-full
                  bg-violet-200/30 mix-blend-multiply dark:mix-blend-screen
                  animate-chaos-2 dark:bg-purple-600/20" />

      <div class="absolute bottom-[-15%] left-[10%] w-[75vw] h-[75vw] rounded-full
                  bg-emerald-200/30 mix-blend-multiply dark:mix-blend-overlay
                  animate-chaos-3 dark:bg-emerald-500/20" />

      <div class="absolute inset-0 m-auto w-[60vw] h-[60vw] rounded-full
                  bg-sky-200/20 animate-pulse-slow" />
    </div>

    <div class="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
  </div>
</template>

<style scoped>
/* Animaciones caóticas con trayectorias irregulares */
@keyframes chaos-1 {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(10%, 15%) scale(1.2) rotate(15deg); }
  66% { transform: translate(-5%, 20%) scale(0.8) rotate(-10deg); }
  100% { transform: translate(0, 0) scale(1); }
}

@keyframes chaos-2 {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-15%, -10%) scale(1.1) rotate(-20deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

@keyframes chaos-3 {
  0% { transform: translate(0, 0) scale(1); }
  40% { transform: translate(20%, -5%) scale(1.3); }
  80% { transform: translate(-10%, -15%) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.1); }
}

.animate-chaos-1 { animation: chaos-1 18s infinite ease-in-out; }
.animate-chaos-2 { animation: chaos-2 22s infinite ease-in-out reverse; }
.animate-chaos-3 { animation: chaos-3 25s infinite linear; }
.animate-pulse-slow { animation: pulse-slow 12s infinite ease-in-out; }
</style>