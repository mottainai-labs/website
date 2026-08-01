/* Scroll choreography for the Mobius mark.
 *
 * Chrome, Edge and Safari do all of this in CSS via scroll-driven animations,
 * with no JavaScript at all. This file exists only for engines that lack them
 * (Firefox, at time of writing), where IntersectionObserver plays the same
 * sequence: draw the loop, park it bottom left, then fade the copy in.
 *
 * No scroll listener anywhere: it runs every frame and janks on mobile.
 */
(function () {
  var stage = document.querySelector('.stage');
  if (!stage) return;

  // CSS already owns the choreography here.
  if (window.CSS && CSS.supports && CSS.supports('animation-timeline', 'view()')) return;

  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia && matchMedia('(max-width: 860px)').matches) return;

  // Only now hide anything, so any bail-out above leaves a complete, readable page.
  stage.classList.add('js');

  // Draw the loop, then park it once the first copy block arrives.
  var drawn = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      stage.classList.add('drawn');
      drawn.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  drawn.observe(stage);

  var steps = stage.querySelectorAll('.step');

  var park = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      stage.classList.add('parked');
      park.unobserve(e.target);
    });
  }, { threshold: 0.1 });
  if (steps[0]) park.observe(steps[0]);

  var reveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      reveal.unobserve(e.target);
    });
  }, { threshold: 0.25 });
  Array.prototype.forEach.call(steps, function (s) { reveal.observe(s); });
})();
