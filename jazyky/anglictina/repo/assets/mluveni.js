// Mluvení na čas: stejný obsah v několika kolech, každé kratší než předchozí.
// Použití: <div class="mluveni" data-rounds="60,45,30"></div>. Každé dokončené kolo se počítá do denního cíle.
(function () {
  document.querySelectorAll(".mluveni").forEach(function (root) {
    const rounds = root.dataset.rounds.split(",").map(Number);
    root.innerHTML =
      '<div class="progress"></div><div class="time" role="timer"></div><p class="prompt"></p>' +
      '<div class="actions"><button type="button" class="primary go"></button></div>';
    const $ = function (s) { return root.querySelector(s); };
    let r = 0, tick = null;

    function idle() {
      $(".progress").textContent = "Kolo " + (r + 1) + " / " + rounds.length;
      $(".time").textContent = rounds[r] + " s";
      $(".prompt").textContent = r === 0
        ? "Mluv nahlas celou dobu. Když se zasekneš, řekni to jinak a pokračuj."
        : "Stejný obsah, méně času. Vynech váhání, ne informace.";
      $(".go").textContent = "Spustit " + (r + 1) + ". kolo";
      $(".go").hidden = false;
    }
    function end() {
      clearInterval(tick); tick = null;
      if (window.Zivost) window.Zivost.answer(true);
      r++;
      if (r < rounds.length) { idle(); return; }
      $(".progress").textContent = "Hotovo";
      $(".time").textContent = "✓";
      $(".prompt").textContent = "Poslední kolo mělo znít nejplynuleji. Co tě brzdilo, to si zapiš a zeptej se na to.";
      $(".go").textContent = "Znovu od začátku";
      $(".go").hidden = false;
      r = -1;
    }
    $(".go").onclick = function () {
      if (r < 0) { r = 0; idle(); return; }
      const stop = Date.now() + rounds[r] * 1000;
      $(".go").hidden = true;
      $(".prompt").textContent = "Mluv!";
      function step() {
        const left = Math.ceil((stop - Date.now()) / 1000);
        if (left <= 0) { end(); return; }
        $(".time").textContent = left + " s";
      }
      step();
      tick = setInterval(step, 250);
    };
    idle();
  });
})();
