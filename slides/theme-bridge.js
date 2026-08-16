/* 小山学堂课程主题桥
   可在 <head> 同步加载，也可由 learn.html 注入 iframe：
   先设置 data-theme 避免闪白，DOM 就绪后再归一旧页面的硬编码颜色。 */
(function(){
  'use strict';

  function normalizeLegacyPalette(){
    var root = document.documentElement;
    if(root.hasAttribute('data-xueai-palette-normalized')) return;
    root.setAttribute('data-xueai-palette-normalized', '');

    function normalizeProperty(style, prop){
      if(!style || !prop) return;
      var value = style.getPropertyValue(prop);
      if(!value) return;
      var next = value;

      if(prop.indexOf('--') === 0){
        var customExact = next.trim().toLowerCase();
        var customMap = {
          '#9d174d':'var(--semantic-pink)',
          '#f4f4f5':'var(--card-2)',
          '#f7f7fa':'var(--card-2)',
          '#fff7e6':'color-mix(in srgb,var(--amber) 12%,var(--card))',
          '#fff8e8':'color-mix(in srgb,var(--amber) 12%,var(--card))',
          '#fff8e9':'color-mix(in srgb,var(--amber) 12%,var(--card))',
          '#c2410c':'var(--semantic-orange)',
          '#7c2d12':'var(--semantic-orange)',
          '#7f1d1d':'var(--danger)',
          '#92400e':'var(--amber)',
          '#0f766e':'var(--success)',
          '#115e59':'var(--success)',
          '#14532d':'var(--success)',
          '#166534':'var(--success)',
          '#075985':'var(--semantic-cyan)',
          '#1e40af':'var(--semantic-blue)',
          '#3450d4':'var(--semantic-blue)',
          '#35508c':'var(--semantic-blue)',
          '#312e81':'var(--semantic-indigo)',
          '#3730a3':'var(--semantic-indigo)',
          '#4338ca':'var(--semantic-indigo)',
          '#6d28d9':'var(--semantic-purple)',
          '#c98f1d':'var(--amber)',
          '#2f8163':'var(--success)'
        };
        if(customMap[customExact] && customMap[customExact] !== 'var(' + prop + ')'){
          style.setProperty(prop, customMap[customExact], style.getPropertyPriority(prop));
        }
        return;
      }

      next = next.replace(/#0066ff/gi, 'var(--accent)');
      next = next.replace(/#4f7bff/gi, 'var(--accent)');
      next = next.replace(/rgb\(\s*0\s*,\s*102\s*,\s*255\s*\)/gi, 'var(--accent)');
      next = next.replace(
        /rgba\(\s*0\s*,\s*102\s*,\s*255\s*,\s*([\d.]+)\s*\)/gi,
        function(_, alpha){
          return 'color-mix(in srgb, var(--accent) ' +
            Math.round(Math.max(0, Math.min(1, Number(alpha))) * 100) +
            '%, transparent)';
        }
      );

      if(prop === 'background' || prop === 'background-color'){
        next = next
          .replace(/#ffffff(?![\da-f])/gi, 'var(--card)')
          .replace(/#fff(?![\da-f])/gi, 'var(--card)')
          .replace(/\bwhite\b/gi, 'var(--card)')
          .replace(/rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/gi, 'var(--card)')
          .replace(
            /rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([\d.]+)\s*\)/gi,
            function(_, alpha){
              return 'color-mix(in srgb,var(--card) ' +
                Math.round(Math.max(0, Math.min(1, Number(alpha))) * 100) +
                '%,transparent)';
            }
          )
          .replace(/#f7f5f0(?![\da-f])/gi, 'var(--bg)')
          .replace(/#f9fafb(?![\da-f])/gi, 'var(--card-2)')
          .replace(/#f8fafc(?![\da-f])/gi, 'var(--card-2)')
          .replace(/#f8f9fa(?![\da-f])/gi, 'var(--bg-dim)')
          .replace(/#f3f4f6(?![\da-f])/gi, 'var(--card-2)')
          .replace(/#f1f5f9(?![\da-f])/gi, 'var(--card-2)')
          .replace(/rgb\(\s*(?:249\s*,\s*250\s*,\s*251|248\s*,\s*250\s*,\s*252|248\s*,\s*249\s*,\s*250|244\s*,\s*245\s*,\s*247|244\s*,\s*244\s*,\s*245|243\s*,\s*244\s*,\s*246|241\s*,\s*245\s*,\s*249|240\s*,\s*237\s*,\s*230|238\s*,\s*232\s*,\s*220|234\s*,\s*231\s*,\s*223|233\s*,\s*236\s*,\s*233)\s*\)/gi, 'var(--card-2)')
          .replace(/#eff6ff(?![\da-f])/gi, 'color-mix(in srgb,var(--accent) 10%,var(--card))')
          .replace(/#eef2ff(?![\da-f])/gi, 'color-mix(in srgb,var(--accent) 12%,var(--card))')
          .replace(/#f3f7ff(?![\da-f])/gi, 'color-mix(in srgb,var(--accent) 8%,var(--card))')
          .replace(/#dbeafe(?![\da-f])/gi, 'color-mix(in srgb,var(--accent) 18%,var(--card))')
          .replace(/rgb\(\s*(?:239\s*,\s*246\s*,\s*255|219\s*,\s*234\s*,\s*254|238\s*,\s*242\s*,\s*255)\s*\)/gi, 'color-mix(in srgb,var(--accent) 12%,var(--card))')
          .replace(/#f0fdf4(?![\da-f])/gi, 'color-mix(in srgb,var(--success) 10%,var(--card))')
          .replace(/rgb\(\s*(?:240\s*,\s*253\s*,\s*244|220\s*,\s*252\s*,\s*231)\s*\)/gi, 'color-mix(in srgb,var(--success) 10%,var(--card))')
          .replace(/#fef2f2(?![\da-f])/gi, 'color-mix(in srgb,var(--danger) 10%,var(--card))')
          .replace(/#fff1f2(?![\da-f])/gi, 'color-mix(in srgb,var(--danger) 12%,var(--card))')
          .replace(/rgb\(\s*(?:254\s*,\s*242\s*,\s*242|255\s*,\s*241\s*,\s*242)\s*\)/gi, 'color-mix(in srgb,var(--danger) 10%,var(--card))')
          .replace(/#fffbeb(?![\da-f])/gi, 'color-mix(in srgb,var(--amber) 10%,var(--card))')
          .replace(/#fff7ed(?![\da-f])/gi, 'color-mix(in srgb,var(--amber) 12%,var(--card))')
          .replace(/rgb\(\s*(?:255\s*,\s*251\s*,\s*235|255\s*,\s*247\s*,\s*(?:230|237)|255\s*,\s*248\s*,\s*(?:232|233)|254\s*,\s*249\s*,\s*195|254\s*,\s*243\s*,\s*199)\s*\)/gi, 'color-mix(in srgb,var(--amber) 12%,var(--card))');
      }

      if(prop === 'color'){
        var exact = next.trim().toLowerCase();
        if(/^(?:#0f172a|#0f1729|#191f28|#1c1c1e|#1f2937|#111827|#111111|#111|#000000|#000|rgb\(\s*(?:0\s*,\s*0\s*,\s*0|15\s*,\s*23\s*,\s*(?:41|42)|17\s*,\s*17\s*,\s*17|17\s*,\s*24\s*,\s*39|25\s*,\s*31\s*,\s*40|28\s*,\s*28\s*,\s*30|31\s*,\s*41\s*,\s*55)\s*\))$/.test(exact)){
          next = 'var(--text)';
        }else if(/^(?:#374151|#475569|#4b5563|#64748b|#6b7280|#6b7688|#6b6b70|#8b95a7|#94a3b8|#9ca3af|rgb\(\s*(?:55\s*,\s*65\s*,\s*81|71\s*,\s*85\s*,\s*105|75\s*,\s*85\s*,\s*99|100\s*,\s*116\s*,\s*139|107\s*,\s*107\s*,\s*112|107\s*,\s*114\s*,\s*128|107\s*,\s*118\s*,\s*136|139\s*,\s*149\s*,\s*167|148\s*,\s*163\s*,\s*184|156\s*,\s*163\s*,\s*175)\s*\))$/.test(exact)){
          next = 'var(--sub)';
        }else if(/^(?:#1e40af|#1e3a5f|#1d4ed8|#2b59c3|#3450d4|rgb\(\s*(?:30\s*,\s*58\s*,\s*95|30\s*,\s*64\s*,\s*175|29\s*,\s*78\s*,\s*216|43\s*,\s*89\s*,\s*195|52\s*,\s*80\s*,\s*212)\s*\))$/.test(exact)){
          next = 'var(--semantic-blue)';
        }else if(/^(?:#312e81|#3730a3|#4338ca|rgb\(\s*(?:49\s*,\s*46\s*,\s*129|55\s*,\s*48\s*,\s*163|67\s*,\s*56\s*,\s*202)\s*\))$/.test(exact)){
          next = 'var(--semantic-indigo)';
        }else if(/^(?:#6d28d9|#7c3aed|rgb\(\s*(?:109\s*,\s*40\s*,\s*217|124\s*,\s*58\s*,\s*237)\s*\))$/.test(exact)){
          next = 'var(--semantic-purple)';
        }else if(/^(?:#9d174d|rgb\(\s*157\s*,\s*23\s*,\s*77\s*\))$/.test(exact)){
          next = 'var(--semantic-pink)';
        }else if(/^(?:#7f1d1d|#991b1b|rgb\(\s*(?:127\s*,\s*29\s*,\s*29|153\s*,\s*27\s*,\s*27)\s*\))$/.test(exact)){
          next = 'var(--danger)';
        }else if(/^(?:#0e7490|#115e59|#125f5a|#12605a|#14532d|#166534|rgb\(\s*(?:14\s*,\s*116\s*,\s*144|(?:17|18|19)\s*,\s*(?:94|95|96)\s*,\s*(?:89|90)|20\s*,\s*83\s*,\s*45|22\s*,\s*101\s*,\s*52)\s*\))$/.test(exact)){
          next = 'var(--success)';
        }else if(/^(?:#59451f|#5e471f|#78350f|#7c2d12|#92400e|rgb\(\s*(?:89\s*,\s*69\s*,\s*31|94\s*,\s*71\s*,\s*31|120\s*,\s*53\s*,\s*15|124\s*,\s*45\s*,\s*18|146\s*,\s*64\s*,\s*14)\s*\))$/.test(exact)){
          next = 'var(--amber)';
        }else if(/^(?:#1a0dab|rgb\(\s*26\s*,\s*13\s*,\s*171\s*\))$/.test(exact)){
          next = 'var(--semantic-blue)';
        }
      }

      if(prop.indexOf('border') === 0){
        next = next
          .replace(/#bfdbfe(?![\da-f])/gi, 'color-mix(in srgb,var(--accent) 38%,transparent)')
          .replace(/#fecaca(?![\da-f])/gi, 'color-mix(in srgb,var(--danger) 38%,transparent)')
          .replace(/#bbf7d0(?![\da-f])/gi, 'color-mix(in srgb,var(--success) 38%,transparent)')
          .replace(/#fde68a(?![\da-f])/gi, 'color-mix(in srgb,var(--amber) 38%,transparent)');
      }

      if(next !== value){
        style.setProperty(prop, next, style.getPropertyPriority(prop));
      }
    }

    function walkRules(rules){
      if(!rules) return;
      for(var i = 0; i < rules.length; i++){
        var rule = rules[i];
        if(rule.style){
          for(var j = rule.style.length - 1; j >= 0; j--){
            normalizeProperty(rule.style, rule.style[j]);
          }
        }
        try{ if(rule.cssRules) walkRules(rule.cssRules); }catch(e){}
      }
    }

    for(var i = 0; i < document.styleSheets.length; i++){
      try{ walkRules(document.styleSheets[i].cssRules); }catch(e){}
    }
    document.querySelectorAll('[style]').forEach(function(el){
      for(var i = el.style.length - 1; i >= 0; i--){
        normalizeProperty(el.style, el.style[i]);
      }
    });
  }

  function ensureLegacyVariables(){
    if(document.getElementById('xueaiThemeLegacyVars')) return;
    var style = document.createElement('style');
    style.id = 'xueaiThemeLegacyVars';
    style.textContent =
      ':root[data-theme="light"]{' +
        '--accent:#146b54;' +
        '--semantic-blue:#1e40af;' +
        '--semantic-indigo:#3730a3;' +
        '--semantic-purple:#6d28d9;' +
        '--semantic-pink:#9d174d;' +
        '--semantic-orange:#9a4d10;' +
        '--semantic-cyan:#075985;' +
      '}' +
      ':root[data-theme="dark"]{' +
        '--bg-color:#101512;' +
        '--card-bg:#171d19;' +
        '--surface:#171d19;' +
        '--surface2:#1b221e;' +
        '--panel:#171d19;' +
        '--text-main:#e9ece9;' +
        '--text-sub:#a3ada8;' +
        '--muted:#a3ada8;' +
        '--accent:#5cb595;' +
        '--semantic-blue:#8aa0ff;' +
        '--semantic-indigo:#9aa5ff;' +
        '--semantic-purple:#b59cff;' +
        '--semantic-pink:#f18ab5;' +
        '--semantic-orange:#efad69;' +
        '--semantic-cyan:#7fc7e8;' +
      '}';
    document.head.appendChild(style);
  }

  var finishScheduled = false;

  function finishTheme(){
    normalizeLegacyPalette();
    var theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    try{
      window.dispatchEvent(new CustomEvent('xueai-themechange', {
        detail: {theme: theme}
      }));
    }catch(e){}
  }

  function applyTheme(value){
    var theme = value === 'dark' ? 'dark' : 'light';
    ensureLegacyVariables();
    document.documentElement.setAttribute('data-theme', theme);
    if(document.readyState === 'loading'){
      if(!finishScheduled){
        finishScheduled = true;
        document.addEventListener('DOMContentLoaded', finishTheme, {once:true});
      }
    }else{
      finishTheme();
    }
  }

  window.XueaiThemeBridge = {apply: applyTheme};

  try{ applyTheme(localStorage.getItem('ai_course_theme') || 'light'); }
  catch(e){ applyTheme('light'); }

  window.addEventListener('message', function(e){
    if(e.origin !== location.origin) return;
    var data = e.data;
    if(data && data.type === 'xueai-theme') applyTheme(data.theme);
  });
})();
