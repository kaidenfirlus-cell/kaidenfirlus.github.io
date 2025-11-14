console.log('index.js loaded');

// index.js — unified accordion with password gate (only on index.html)
document.addEventListener('DOMContentLoaded', () => {
  const PASSWORD = 'Adelaide1';
  const isIndex =
    window.location.pathname.endsWith('index.html') ||
    window.location.pathname === '/' ||
    window.location.pathname === '';

  if (isIndex) {
    // --- PASSWORD GATE ---
    const body = document.body;
    const pageContent = body.innerHTML;
    body.innerHTML = `
      <div id="password-gate" style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;font-family:sans-serif;">
        <h2>Enter Password to View Page</h2>
        <input type="password" id="pw-input" placeholder="Password" style="padding:0.5em;font-size:1em;">
        <button id="pw-submit" style="margin-top:1em;padding:0.5em 1em;font-size:1em;">Submit</button>
        <p id="pw-error" style="color:red;margin-top:0.5em;display:none;">Incorrect password</p>
      </div>
    `;

    const input = document.getElementById('pw-input');
    const submit = document.getElementById('pw-submit');
    const error = document.getElementById('pw-error');

    const unlockPage = () => {
      if (input.value === PASSWORD) {
        body.innerHTML = pageContent;
        initAccordion();
      } else {
        error.style.display = 'block';
      }
    };

    submit.addEventListener('click', unlockPage);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') unlockPage();
    });
  } else {
    // Skip password gate on other pages, just init accordion
    initAccordion();
  }

  // --- ACCORDION INIT ---
  function initAccordion() {
    const openPanel = (panel) => {
      panel.classList.add('open');
      panel.style.maxHeight = panel.scrollHeight + 'px';
      panel.setAttribute('aria-hidden', 'false');
    };

    const closePanel = (panel) => {
      panel.classList.remove('open');
      panel.style.maxHeight = null;
      panel.setAttribute('aria-hidden', 'true');
    };

    const togglePanel = (panel) => {
      if (!panel) return;
      panel.classList.contains('open') ? closePanel(panel) : openPanel(panel);
    };

    // Initialize all panels closed
    document.querySelectorAll('.accordion-panel, .nested-panel, .accordion-body').forEach(p => {
      p.classList.remove('open');
      p.style.maxHeight = null;
      p.setAttribute('aria-hidden', 'true');
    });

    // Top-level toggles
    document.querySelectorAll('.accordion-toggle').forEach(btn => {
      const targetId = btn.dataset.target;
      const panel = targetId ? document.getElementById(targetId) : null;
      if (panel) {
        btn.setAttribute('aria-controls', targetId);
        btn.setAttribute('aria-expanded', 'false');
        panel.setAttribute('role', 'region');
      }

      btn.addEventListener('click', () => {
        document.querySelectorAll('.accordion-panel').forEach(p => {
          if (p !== panel) {
            closePanel(p);
            const otherToggle = document.querySelector(`.accordion-toggle[data-target="${p.id}"]`);
            if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
          }
        });
        togglePanel(panel);
        if (panel) btn.setAttribute('aria-expanded', panel.classList.contains('open').toString());
        if (panel && !panel.classList.contains('open')) {
          panel.querySelectorAll('.nested-panel').forEach(np => closePanel(np));
          panel.querySelectorAll('.nested-toggle').forEach(nt => nt.setAttribute('aria-expanded', 'false'));
        }
      });
    });

    // Nested toggles
    document.querySelectorAll('.nested-toggle').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', () => {
        const panel = btn.nextElementSibling;
        if (!panel || !panel.classList.contains('nested-panel')) return;

        const group = btn.closest('.nested-accordion');
        const selector = group
          ? `.nested-accordion[data-group="${group.dataset.group}"] .nested-panel`
          : '.nested-panel';

        document.querySelectorAll(selector).forEach(np => {
          if (np !== panel) {
            closePanel(np);
            const togg = np.previousElementSibling;
            if (togg && togg.classList.contains('nested-toggle'))
              togg.setAttribute('aria-expanded', 'false');
          }
        });

        togglePanel(panel);
        btn.setAttribute('aria-expanded', panel.classList.contains('open').toString());
      });
    });

    // Header + body pattern
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.setAttribute('aria-expanded', 'false');
      header.setAttribute('role', 'button');
      header.tabIndex = 0;

      const body = header.nextElementSibling;
      if (body && body.classList.contains('accordion-body'))
        body.setAttribute('aria-hidden', 'true');

      const clickToggle = () => {
        document.querySelectorAll('.accordion-body').forEach(b => {
          if (b !== body) closePanel(b);
        });
        if (body) {
          togglePanel(body);
          header.setAttribute('aria-expanded', body.classList.contains('open').toString());
        }
      };

      header.addEventListener('click', clickToggle);
      header.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          clickToggle();
        }
      });
    });
  }
});
