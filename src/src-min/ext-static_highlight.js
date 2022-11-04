define(
  "ace/ext/static.css",
  ["require", "exports", "module"],
  function (e, t, n) {
    n.exports =
      ".ace_static_highlight {\n    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', 'Droid Sans Mono', monospace;\n    font-size: 12px;\n    white-space: pre-wrap\n}\n\n.ace_static_highlight .ace_gutter {\n    width: 2em;\n    text-align: right;\n    padding: 0 3px 0 0;\n    margin-right: 3px;\n    contain: none;\n}\n\n.ace_static_highlight.ace_show_gutter .ace_line {\n    padding-left: 2.6em;\n}\n\n.ace_static_highlight .ace_line { position: relative; }\n\n.ace_static_highlight .ace_gutter-cell {\n    -moz-user-select: -moz-none;\n    -khtml-user-select: none;\n    -webkit-user-select: none;\n    user-select: none;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    position: absolute;\n}\n\n\n.ace_static_highlight .ace_gutter-cell:before {\n    content: counter(ace_line, decimal);\n    counter-increment: ace_line;\n}\n.ace_static_highlight {\n    counter-reset: ace_line;\n}\n";
  }
),
  define(
    "ace/ext/static_highlight",
    [
      "require",
      "exports",
      "module",
      "ace/edit_session",
      "ace/layer/text",
      "ace/ext/static.css",
      "ace/config",
      "ace/lib/dom",
      "ace/lib/lang",
    ],
    function (e, t, n) {
      "use strict";
      function f(e) {
        (this.type = e), (this.style = {}), (this.textContent = "");
      }
      var r = e("../edit_session").EditSession,
        i = e("../layer/text").Text,
        s = e("./static.css"),
        o = e("../config"),
        u = e("../lib/dom"),
        a = e("../lib/lang").escapeHTML;
      (f.prototype.cloneNode = function () {
        return this;
      }),
        (f.prototype.appendChild = function (e) {
          this.textContent += e.toString();
        }),
        (f.prototype.toString = function () {
          var e = [];
          if (this.type != "fragment") {
            e.push("<", this.type),
              this.className && e.push(" class='", this.className, "'");
            var t = [];
            for (var n in this.style) t.push(n, ":", this.style[n]);
            t.length && e.push(" style='", t.join(""), "'"), e.push(">");
          }
          return (
            this.textContent && e.push(this.textContent),
            this.type != "fragment" && e.push("</", this.type, ">"),
            e.join("")
          );
        });
      var l = {
          createTextNode: function (e, t) {
            return a(e);
          },
          createElement: function (e) {
            return new f(e);
          },
          createFragment: function () {
            return new f("fragment");
          },
        },
        c = function () {
          (this.config = {}), (this.dom = l);
        };
      c.prototype = i.prototype;
      var h = function (e, t, n) {
        var r = e.className.match(/lang-(\w+)/),
          i = t.mode || (r && "ace/mode/" + r[1]);
        if (!i) return !1;
        var s = t.theme || "ace/theme/textmate",
          o = "",
          a = [];
        if (e.firstElementChild) {
          var f = 0;
          for (var l = 0; l < e.childNodes.length; l++) {
            var c = e.childNodes[l];
            c.nodeType == 3
              ? ((f += c.data.length), (o += c.data))
              : a.push(f, c);
          }
        } else (o = e.textContent), t.trim && (o = o.trim());
        h.render(o, i, s, t.firstLineNumber, !t.showGutter, function (t) {
          u.importCssString(t.css, "ace_highlight"), (e.innerHTML = t.html);
          var r = e.firstChild.firstChild;
          for (var i = 0; i < a.length; i += 2) {
            var s = t.session.doc.indexToPosition(a[i]),
              o = a[i + 1],
              f = r.children[s.row];
            f && f.appendChild(o);
          }
          n && n();
        });
      };
      (h.render = function (e, t, n, i, s, u) {
        function c() {
          var r = h.renderSync(e, t, n, i, s);
          return u ? u(r) : r;
        }
        var a = 1,
          f = r.prototype.$modes;
        typeof n == "string" &&
          (a++,
          o.loadModule(["theme", n], function (e) {
            (n = e), --a || c();
          }));
        var l;
        return (
          t &&
            typeof t == "object" &&
            !t.getTokenizer &&
            ((l = t), (t = l.path)),
          typeof t == "string" &&
            (a++,
            o.loadModule(["mode", t], function (e) {
              if (!f[t] || l) f[t] = new e.Mode(l);
              (t = f[t]), --a || c();
            })),
          --a || c()
        );
      }),
        (h.renderSync = function (e, t, n, i, o) {
          i = parseInt(i || 1, 10);
          var u = new r("");
          u.setUseWorker(!1), u.setMode(t);
          var a = new c();
          a.setSession(u),
            Object.keys(a.$tabStrings).forEach(function (e) {
              if (typeof a.$tabStrings[e] == "string") {
                var t = l.createFragment();
                (t.textContent = a.$tabStrings[e]), (a.$tabStrings[e] = t);
              }
            }),
            u.setValue(e);
          var f = u.getLength(),
            h = l.createElement("div");
          h.className = n.cssClass;
          var p = l.createElement("div");
          (p.className =
            "ace_static_highlight" + (o ? "" : " ace_show_gutter")),
            (p.style["counter-reset"] = "ace_line " + (i - 1));
          for (var d = 0; d < f; d++) {
            var v = l.createElement("div");
            v.className = "ace_line";
            if (!o) {
              var m = l.createElement("span");
              (m.className = "ace_gutter ace_gutter-cell"),
                (m.textContent = ""),
                v.appendChild(m);
            }
            a.$renderLine(v, d, !1), (v.textContent += "\n"), p.appendChild(v);
          }
          return (
            h.appendChild(p),
            { css: s + n.cssText, html: h.toString(), session: u }
          );
        }),
        (n.exports = h),
        (n.exports.highlight = h);
    }
  );
(function () {
  window.require(["ace/ext/static_highlight"], function (m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
