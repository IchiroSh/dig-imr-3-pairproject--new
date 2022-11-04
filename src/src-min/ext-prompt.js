define(
  "ace/ext/menu_tools/get_editor_keyboard_shortcuts",
  ["require", "exports", "module", "ace/lib/keys"],
  function (e, t, n) {
    "use strict";
    var r = e("../../lib/keys");
    n.exports.getEditorKeybordShortcuts = function (e) {
      var t = r.KEY_MODS,
        n = [],
        i = {};
      return (
        e.keyBinding.$handlers.forEach(function (e) {
          var t = e.commandKeyBinding;
          for (var r in t) {
            var s = r.replace(/(^|-)\w/g, function (e) {
                return e.toUpperCase();
              }),
              o = t[r];
            Array.isArray(o) || (o = [o]),
              o.forEach(function (e) {
                typeof e != "string" && (e = e.name),
                  i[e]
                    ? (i[e].key += "|" + s)
                    : ((i[e] = { key: s, command: e }), n.push(i[e]));
              });
          }
        }),
        n
      );
    };
  }
),
  define(
    "ace/autocomplete/popup",
    [
      "require",
      "exports",
      "module",
      "ace/virtual_renderer",
      "ace/editor",
      "ace/range",
      "ace/lib/event",
      "ace/lib/lang",
      "ace/lib/dom",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../virtual_renderer").VirtualRenderer,
        i = e("../editor").Editor,
        s = e("../range").Range,
        o = e("../lib/event"),
        u = e("../lib/lang"),
        a = e("../lib/dom"),
        f = function (e) {
          var t = new r(e);
          t.$maxLines = 4;
          var n = new i(t);
          return (
            n.setHighlightActiveLine(!1),
            n.setShowPrintMargin(!1),
            n.renderer.setShowGutter(!1),
            n.renderer.setHighlightGutterLine(!1),
            (n.$mouseHandler.$focusTimeout = 0),
            (n.$highlightTagPending = !0),
            n
          );
        },
        l = function (e) {
          var t = a.createElement("div"),
            n = new f(t);
          e && e.appendChild(t),
            (t.style.display = "none"),
            (n.renderer.content.style.cursor = "default"),
            n.renderer.setStyle("ace_autocomplete"),
            n.setOption("displayIndentGuides", !1),
            n.setOption("dragDelay", 150);
          var r = function () {};
          (n.focus = r),
            (n.$isFocused = !0),
            (n.renderer.$cursorLayer.restartTimer = r),
            (n.renderer.$cursorLayer.element.style.opacity = 0),
            (n.renderer.$maxLines = 8),
            (n.renderer.$keepTextAreaAtCursor = !1),
            n.setHighlightActiveLine(!1),
            n.session.highlight(""),
            (n.session.$searchHighlight.clazz = "ace_highlight-marker"),
            n.on("mousedown", function (e) {
              var t = e.getDocumentPosition();
              n.selection.moveToPosition(t),
                (c.start.row = c.end.row = t.row),
                e.stop();
            });
          var i,
            l = new s(-1, 0, -1, Infinity),
            c = new s(-1, 0, -1, Infinity);
          (c.id = n.session.addMarker(c, "ace_active-line", "fullLine")),
            (n.setSelectOnHover = function (e) {
              e
                ? l.id && (n.session.removeMarker(l.id), (l.id = null))
                : (l.id = n.session.addMarker(l, "ace_line-hover", "fullLine"));
            }),
            n.setSelectOnHover(!1),
            n.on("mousemove", function (e) {
              if (!i) {
                i = e;
                return;
              }
              if (i.x == e.x && i.y == e.y) return;
              (i = e), (i.scrollTop = n.renderer.scrollTop);
              var t = i.getDocumentPosition().row;
              l.start.row != t && (l.id || n.setRow(t), p(t));
            }),
            n.renderer.on("beforeRender", function () {
              if (i && l.start.row != -1) {
                i.$pos = null;
                var e = i.getDocumentPosition().row;
                l.id || n.setRow(e), p(e, !0);
              }
            }),
            n.renderer.on("afterRender", function () {
              var e = n.getRow(),
                t = n.renderer.$textLayer,
                r = t.element.childNodes[e - t.config.firstRow];
              r !== t.selectedNode &&
                t.selectedNode &&
                a.removeCssClass(t.selectedNode, "ace_selected"),
                (t.selectedNode = r),
                r && a.addCssClass(r, "ace_selected");
            });
          var h = function () {
              p(-1);
            },
            p = function (e, t) {
              e !== l.start.row &&
                ((l.start.row = l.end.row = e),
                t || n.session._emit("changeBackMarker"),
                n._emit("changeHoverMarker"));
            };
          (n.getHoveredRow = function () {
            return l.start.row;
          }),
            o.addListener(n.container, "mouseout", h),
            n.on("hide", h),
            n.on("changeSelection", h),
            (n.session.doc.getLength = function () {
              return n.data.length;
            }),
            (n.session.doc.getLine = function (e) {
              var t = n.data[e];
              return typeof t == "string" ? t : (t && t.value) || "";
            });
          var d = n.session.bgTokenizer;
          return (
            (d.$tokenizeRow = function (e) {
              function s(e, n) {
                e &&
                  r.push({ type: (t.className || "") + (n || ""), value: e });
              }
              var t = n.data[e],
                r = [];
              if (!t) return r;
              typeof t == "string" && (t = { value: t });
              var i = t.caption || t.value || t.name,
                o = i.toLowerCase(),
                u = (n.filterText || "").toLowerCase(),
                a = 0,
                f = 0;
              for (var l = 0; l <= u.length; l++)
                if (l != f && (t.matchMask & (1 << l) || l == u.length)) {
                  var c = u.slice(f, l);
                  f = l;
                  var h = o.indexOf(c, a);
                  if (h == -1) continue;
                  s(i.slice(a, h), ""),
                    (a = h + c.length),
                    s(i.slice(h, a), "completion-highlight");
                }
              return (
                s(i.slice(a, i.length), ""),
                t.meta && r.push({ type: "completion-meta", value: t.meta }),
                t.message &&
                  r.push({ type: "completion-message", value: t.message }),
                r
              );
            }),
            (d.$updateOnChange = r),
            (d.start = r),
            (n.session.$computeWidth = function () {
              return (this.screenWidth = 0);
            }),
            (n.isOpen = !1),
            (n.isTopdown = !1),
            (n.autoSelect = !0),
            (n.filterText = ""),
            (n.data = []),
            (n.setData = function (e, t) {
              (n.filterText = t || ""),
                n.setValue(u.stringRepeat("\n", e.length), -1),
                (n.data = e || []),
                n.setRow(0);
            }),
            (n.getData = function (e) {
              return n.data[e];
            }),
            (n.getRow = function () {
              return c.start.row;
            }),
            (n.setRow = function (e) {
              (e = Math.max(
                this.autoSelect ? 0 : -1,
                Math.min(this.data.length, e)
              )),
                c.start.row != e &&
                  (n.selection.clearSelection(),
                  (c.start.row = c.end.row = e || 0),
                  n.session._emit("changeBackMarker"),
                  n.moveCursorTo(e || 0, 0),
                  n.isOpen && n._signal("select"));
            }),
            n.on("changeSelection", function () {
              n.isOpen && n.setRow(n.selection.lead.row),
                n.renderer.scrollCursorIntoView();
            }),
            (n.hide = function () {
              (this.container.style.display = "none"),
                this._signal("hide"),
                (n.isOpen = !1);
            }),
            (n.show = function (e, t, r) {
              var s = this.container,
                o = window.innerHeight,
                u = window.innerWidth,
                a = this.renderer,
                f = a.$maxLines * t * 1.4,
                l = e.top + this.$borderSize,
                c = l > o / 2 && !r;
              c && l + t + f > o
                ? ((a.$maxPixelHeight = l - 2 * this.$borderSize),
                  (s.style.top = ""),
                  (s.style.bottom = o - l + "px"),
                  (n.isTopdown = !1))
                : ((l += t),
                  (a.$maxPixelHeight = o - l - 0.2 * t),
                  (s.style.top = l + "px"),
                  (s.style.bottom = ""),
                  (n.isTopdown = !0)),
                (s.style.display = "");
              var h = e.left;
              h + s.offsetWidth > u && (h = u - s.offsetWidth),
                (s.style.left = h + "px"),
                this._signal("show"),
                (i = null),
                (n.isOpen = !0);
            }),
            (n.goTo = function (e) {
              var t = this.getRow(),
                n = this.session.getLength() - 1;
              switch (e) {
                case "up":
                  t = t <= 0 ? n : t - 1;
                  break;
                case "down":
                  t = t >= n ? -1 : t + 1;
                  break;
                case "start":
                  t = 0;
                  break;
                case "end":
                  t = n;
              }
              this.setRow(t);
            }),
            (n.getTextLeftOffset = function () {
              return (
                this.$borderSize + this.renderer.$padding + this.$imageSize
              );
            }),
            (n.$imageSize = 0),
            (n.$borderSize = 1),
            n
          );
        };
      a.importCssString(
        "\n.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {\n    background-color: #CAD6FA;\n    z-index: 1;\n}\n.ace_dark.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {\n    background-color: #3a674e;\n}\n.ace_editor.ace_autocomplete .ace_line-hover {\n    border: 1px solid #abbffe;\n    margin-top: -1px;\n    background: rgba(233,233,253,0.4);\n    position: absolute;\n    z-index: 2;\n}\n.ace_dark.ace_editor.ace_autocomplete .ace_line-hover {\n    border: 1px solid rgba(109, 150, 13, 0.8);\n    background: rgba(58, 103, 78, 0.62);\n}\n.ace_completion-meta {\n    opacity: 0.5;\n    margin: 0.9em;\n}\n.ace_completion-message {\n    color: blue;\n}\n.ace_editor.ace_autocomplete .ace_completion-highlight{\n    color: #2d69c7;\n}\n.ace_dark.ace_editor.ace_autocomplete .ace_completion-highlight{\n    color: #93ca12;\n}\n.ace_editor.ace_autocomplete {\n    width: 300px;\n    z-index: 200000;\n    border: 1px lightgray solid;\n    position: fixed;\n    box-shadow: 2px 3px 5px rgba(0,0,0,.2);\n    line-height: 1.4;\n    background: #fefefe;\n    color: #111;\n}\n.ace_dark.ace_editor.ace_autocomplete {\n    border: 1px #484747 solid;\n    box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.51);\n    line-height: 1.4;\n    background: #25282c;\n    color: #c1c1c1;\n}",
        "autocompletion.css",
        !1
      ),
        (t.AcePopup = l),
        (t.$singleLineEditor = f);
    }
  ),
  define(
    "ace/autocomplete/util",
    ["require", "exports", "module"],
    function (e, t, n) {
      "use strict";
      t.parForEach = function (e, t, n) {
        var r = 0,
          i = e.length;
        i === 0 && n();
        for (var s = 0; s < i; s++)
          t(e[s], function (e, t) {
            r++, r === i && n(e, t);
          });
      };
      var r = /[a-zA-Z_0-9\$\-\u00A2-\u2000\u2070-\uFFFF]/;
      (t.retrievePrecedingIdentifier = function (e, t, n) {
        n = n || r;
        var i = [];
        for (var s = t - 1; s >= 0; s--) {
          if (!n.test(e[s])) break;
          i.push(e[s]);
        }
        return i.reverse().join("");
      }),
        (t.retrieveFollowingIdentifier = function (e, t, n) {
          n = n || r;
          var i = [];
          for (var s = t; s < e.length; s++) {
            if (!n.test(e[s])) break;
            i.push(e[s]);
          }
          return i;
        }),
        (t.getCompletionPrefix = function (e) {
          var t = e.getCursorPosition(),
            n = e.session.getLine(t.row),
            r;
          return (
            e.completers.forEach(
              function (e) {
                e.identifierRegexps &&
                  e.identifierRegexps.forEach(
                    function (e) {
                      !r &&
                        e &&
                        (r = this.retrievePrecedingIdentifier(n, t.column, e));
                    }.bind(this)
                  );
              }.bind(this)
            ),
            r || this.retrievePrecedingIdentifier(n, t.column)
          );
        });
    }
  ),
  define(
    "ace/snippets",
    [
      "require",
      "exports",
      "module",
      "ace/lib/dom",
      "ace/lib/oop",
      "ace/lib/event_emitter",
      "ace/lib/lang",
      "ace/range",
      "ace/range_list",
      "ace/keyboard/hash_handler",
      "ace/tokenizer",
      "ace/clipboard",
      "ace/editor",
    ],
    function (e, t, n) {
      "use strict";
      function p(e) {
        var t = new Date().toLocaleString("en-us", e);
        return t.length == 1 ? "0" + t : t;
      }
      var r = e("./lib/dom"),
        i = e("./lib/oop"),
        s = e("./lib/event_emitter").EventEmitter,
        o = e("./lib/lang"),
        u = e("./range").Range,
        a = e("./range_list").RangeList,
        f = e("./keyboard/hash_handler").HashHandler,
        l = e("./tokenizer").Tokenizer,
        c = e("./clipboard"),
        h = {
          CURRENT_WORD: function (e) {
            return e.session.getTextRange(e.session.getWordRange());
          },
          SELECTION: function (e, t, n) {
            var r = e.session.getTextRange();
            return n ? r.replace(/\n\r?([ \t]*\S)/g, "\n" + n + "$1") : r;
          },
          CURRENT_LINE: function (e) {
            return e.session.getLine(e.getCursorPosition().row);
          },
          PREV_LINE: function (e) {
            return e.session.getLine(e.getCursorPosition().row - 1);
          },
          LINE_INDEX: function (e) {
            return e.getCursorPosition().row;
          },
          LINE_NUMBER: function (e) {
            return e.getCursorPosition().row + 1;
          },
          SOFT_TABS: function (e) {
            return e.session.getUseSoftTabs() ? "YES" : "NO";
          },
          TAB_SIZE: function (e) {
            return e.session.getTabSize();
          },
          CLIPBOARD: function (e) {
            return c.getText && c.getText();
          },
          FILENAME: function (e) {
            return /[^/\\]*$/.exec(this.FILEPATH(e))[0];
          },
          FILENAME_BASE: function (e) {
            return /[^/\\]*$/.exec(this.FILEPATH(e))[0].replace(/\.[^.]*$/, "");
          },
          DIRECTORY: function (e) {
            return this.FILEPATH(e).replace(/[^/\\]*$/, "");
          },
          FILEPATH: function (e) {
            return "/not implemented.txt";
          },
          WORKSPACE_NAME: function () {
            return "Unknown";
          },
          FULLNAME: function () {
            return "Unknown";
          },
          BLOCK_COMMENT_START: function (e) {
            var t = e.session.$mode || {};
            return (t.blockComment && t.blockComment.start) || "";
          },
          BLOCK_COMMENT_END: function (e) {
            var t = e.session.$mode || {};
            return (t.blockComment && t.blockComment.end) || "";
          },
          LINE_COMMENT: function (e) {
            var t = e.session.$mode || {};
            return t.lineCommentStart || "";
          },
          CURRENT_YEAR: p.bind(null, { year: "numeric" }),
          CURRENT_YEAR_SHORT: p.bind(null, { year: "2-digit" }),
          CURRENT_MONTH: p.bind(null, { month: "numeric" }),
          CURRENT_MONTH_NAME: p.bind(null, { month: "long" }),
          CURRENT_MONTH_NAME_SHORT: p.bind(null, { month: "short" }),
          CURRENT_DATE: p.bind(null, { day: "2-digit" }),
          CURRENT_DAY_NAME: p.bind(null, { weekday: "long" }),
          CURRENT_DAY_NAME_SHORT: p.bind(null, { weekday: "short" }),
          CURRENT_HOUR: p.bind(null, { hour: "2-digit", hour12: !1 }),
          CURRENT_MINUTE: p.bind(null, { minute: "2-digit" }),
          CURRENT_SECOND: p.bind(null, { second: "2-digit" }),
        };
      h.SELECTED_TEXT = h.SELECTION;
      var d = function () {
        (this.snippetMap = {}), (this.snippetNameMap = {});
      };
      (function () {
        i.implement(this, s),
          (this.getTokenizer = function () {
            return d.$tokenizer || this.createTokenizer();
          }),
          (this.createTokenizer = function () {
            function e(e) {
              return (
                (e = e.substr(1)),
                /^\d+$/.test(e)
                  ? [{ tabstopId: parseInt(e, 10) }]
                  : [{ text: e }]
              );
            }
            function t(e) {
              return "(?:[^\\\\" + e + "]|\\\\.)";
            }
            var n = {
              regex: "/(" + t("/") + "+)/",
              onMatch: function (e, t, n) {
                var r = n[0];
                return (
                  (r.fmtString = !0),
                  (r.guard = e.slice(1, -1)),
                  (r.flag = ""),
                  ""
                );
              },
              next: "formatString",
            };
            return (
              (d.$tokenizer = new l({
                start: [
                  {
                    regex: /\\./,
                    onMatch: function (e, t, n) {
                      var r = e[1];
                      return (
                        r == "}" && n.length
                          ? (e = r)
                          : "`$\\".indexOf(r) != -1 && (e = r),
                        [e]
                      );
                    },
                  },
                  {
                    regex: /}/,
                    onMatch: function (e, t, n) {
                      return [n.length ? n.shift() : e];
                    },
                  },
                  { regex: /\$(?:\d+|\w+)/, onMatch: e },
                  {
                    regex: /\$\{[\dA-Z_a-z]+/,
                    onMatch: function (t, n, r) {
                      var i = e(t.substr(1));
                      return r.unshift(i[0]), i;
                    },
                    next: "snippetVar",
                  },
                  { regex: /\n/, token: "newline", merge: !1 },
                ],
                snippetVar: [
                  {
                    regex: "\\|" + t("\\|") + "*\\|",
                    onMatch: function (e, t, n) {
                      var r = e
                        .slice(1, -1)
                        .replace(/\\[,|\\]|,/g, function (e) {
                          return e.length == 2 ? e[1] : "\0";
                        })
                        .split("\0")
                        .map(function (e) {
                          return { value: e };
                        });
                      return (n[0].choices = r), [r[0]];
                    },
                    next: "start",
                  },
                  n,
                  { regex: "([^:}\\\\]|\\\\.)*:?", token: "", next: "start" },
                ],
                formatString: [
                  {
                    regex: /:/,
                    onMatch: function (e, t, n) {
                      return n.length && n[0].expectElse
                        ? ((n[0].expectElse = !1),
                          (n[0].ifEnd = { elseEnd: n[0] }),
                          [n[0].ifEnd])
                        : ":";
                    },
                  },
                  {
                    regex: /\\./,
                    onMatch: function (e, t, n) {
                      var r = e[1];
                      return (
                        r == "}" && n.length
                          ? (e = r)
                          : "`$\\".indexOf(r) != -1
                          ? (e = r)
                          : r == "n"
                          ? (e = "\n")
                          : r == "t"
                          ? (e = "	")
                          : "ulULE".indexOf(r) != -1 &&
                            (e = { changeCase: r, local: r > "a" }),
                        [e]
                      );
                    },
                  },
                  {
                    regex: "/\\w*}",
                    onMatch: function (e, t, n) {
                      var r = n.shift();
                      return (
                        r && (r.flag = e.slice(1, -1)),
                        (this.next = r && r.tabstopId ? "start" : ""),
                        [r || e]
                      );
                    },
                    next: "start",
                  },
                  {
                    regex: /\$(?:\d+|\w+)/,
                    onMatch: function (e, t, n) {
                      return [{ text: e.slice(1) }];
                    },
                  },
                  {
                    regex: /\${\w+/,
                    onMatch: function (e, t, n) {
                      var r = { text: e.slice(2) };
                      return n.unshift(r), [r];
                    },
                    next: "formatStringVar",
                  },
                  { regex: /\n/, token: "newline", merge: !1 },
                  {
                    regex: /}/,
                    onMatch: function (e, t, n) {
                      var r = n.shift();
                      return (
                        (this.next = r && r.tabstopId ? "start" : ""), [r || e]
                      );
                    },
                    next: "start",
                  },
                ],
                formatStringVar: [
                  {
                    regex: /:\/\w+}/,
                    onMatch: function (e, t, n) {
                      var r = n[0];
                      return (r.formatFunction = e.slice(2, -1)), [n.shift()];
                    },
                    next: "formatString",
                  },
                  n,
                  {
                    regex: /:[\?\-+]?/,
                    onMatch: function (e, t, n) {
                      e[1] == "+" && (n[0].ifEnd = n[0]),
                        e[1] == "?" && (n[0].expectElse = !0);
                    },
                    next: "formatString",
                  },
                  {
                    regex: "([^:}\\\\]|\\\\.)*:?",
                    token: "",
                    next: "formatString",
                  },
                ],
              })),
              d.$tokenizer
            );
          }),
          (this.tokenizeTmSnippet = function (e, t) {
            return this.getTokenizer()
              .getLineTokens(e, t)
              .tokens.map(function (e) {
                return e.value || e;
              });
          }),
          (this.getVariableValue = function (e, t, n) {
            if (/^\d+$/.test(t)) return (this.variables.__ || {})[t] || "";
            if (/^[A-Z]\d+$/.test(t))
              return (this.variables[t[0] + "__"] || {})[t.substr(1)] || "";
            t = t.replace(/^TM_/, "");
            if (!this.variables.hasOwnProperty(t)) return "";
            var r = this.variables[t];
            return (
              typeof r == "function" && (r = this.variables[t](e, t, n)),
              r == null ? "" : r
            );
          }),
          (this.variables = h),
          (this.tmStrFormat = function (e, t, n) {
            if (!t.fmt) return e;
            var r = t.flag || "",
              i = t.guard;
            i = new RegExp(i, r.replace(/[^gim]/g, ""));
            var s =
                typeof t.fmt == "string"
                  ? this.tokenizeTmSnippet(t.fmt, "formatString")
                  : t.fmt,
              o = this,
              u = e.replace(i, function () {
                var e = o.variables.__;
                o.variables.__ = [].slice.call(arguments);
                var t = o.resolveVariables(s, n),
                  r = "E";
                for (var i = 0; i < t.length; i++) {
                  var u = t[i];
                  if (typeof u == "object") {
                    t[i] = "";
                    if (u.changeCase && u.local) {
                      var a = t[i + 1];
                      a &&
                        typeof a == "string" &&
                        (u.changeCase == "u"
                          ? (t[i] = a[0].toUpperCase())
                          : (t[i] = a[0].toLowerCase()),
                        (t[i + 1] = a.substr(1)));
                    } else u.changeCase && (r = u.changeCase);
                  } else
                    r == "U"
                      ? (t[i] = u.toUpperCase())
                      : r == "L" && (t[i] = u.toLowerCase());
                }
                return (o.variables.__ = e), t.join("");
              });
            return u;
          }),
          (this.tmFormatFunction = function (e, t, n) {
            return t.formatFunction == "upcase"
              ? e.toUpperCase()
              : t.formatFunction == "downcase"
              ? e.toLowerCase()
              : e;
          }),
          (this.resolveVariables = function (e, t) {
            function f(t) {
              var n = e.indexOf(t, s + 1);
              n != -1 && (s = n);
            }
            var n = [],
              r = "",
              i = !0;
            for (var s = 0; s < e.length; s++) {
              var o = e[s];
              if (typeof o == "string") {
                n.push(o),
                  o == "\n"
                    ? ((i = !0), (r = ""))
                    : i && ((r = /^\t*/.exec(o)[0]), (i = /\S/.test(o)));
                continue;
              }
              if (!o) continue;
              i = !1;
              if (o.fmtString) {
                var u = e.indexOf(o, s + 1);
                u == -1 && (u = e.length), (o.fmt = e.slice(s + 1, u)), (s = u);
              }
              if (o.text) {
                var a = this.getVariableValue(t, o.text, r) + "";
                o.fmtString && (a = this.tmStrFormat(a, o, t)),
                  o.formatFunction && (a = this.tmFormatFunction(a, o, t)),
                  a && !o.ifEnd
                    ? (n.push(a), f(o))
                    : !a && o.ifEnd && f(o.ifEnd);
              } else
                o.elseEnd
                  ? f(o.elseEnd)
                  : o.tabstopId != null
                  ? n.push(o)
                  : o.changeCase != null && n.push(o);
            }
            return n;
          }),
          (this.insertSnippetForSelection = function (e, t) {
            function f(e) {
              var t = [];
              for (var n = 0; n < e.length; n++) {
                var r = e[n];
                if (typeof r == "object") {
                  if (a[r.tabstopId]) continue;
                  var i = e.lastIndexOf(r, n - 1);
                  r = t[i] || { tabstopId: r.tabstopId };
                }
                t[n] = r;
              }
              return t;
            }
            var n = e.getCursorPosition(),
              r = e.session.getLine(n.row),
              i = e.session.getTabString(),
              s = r.match(/^\s*/)[0];
            n.column < s.length && (s = s.slice(0, n.column)),
              (t = t.replace(/\r/g, ""));
            var o = this.tokenizeTmSnippet(t);
            (o = this.resolveVariables(o, e)),
              (o = o.map(function (e) {
                return e == "\n"
                  ? e + s
                  : typeof e == "string"
                  ? e.replace(/\t/g, i)
                  : e;
              }));
            var u = [];
            o.forEach(function (e, t) {
              if (typeof e != "object") return;
              var n = e.tabstopId,
                r = u[n];
              r ||
                ((r = u[n] = []),
                (r.index = n),
                (r.value = ""),
                (r.parents = {}));
              if (r.indexOf(e) !== -1) return;
              e.choices && !r.choices && (r.choices = e.choices), r.push(e);
              var i = o.indexOf(e, t + 1);
              if (i === -1) return;
              var s = o.slice(t + 1, i),
                a = s.some(function (e) {
                  return typeof e == "object";
                });
              a && !r.value
                ? (r.value = s)
                : s.length &&
                  (!r.value || typeof r.value != "string") &&
                  (r.value = s.join(""));
            }),
              u.forEach(function (e) {
                e.length = 0;
              });
            var a = {};
            for (var l = 0; l < o.length; l++) {
              var c = o[l];
              if (typeof c != "object") continue;
              var h = c.tabstopId,
                p = u[h],
                d = o.indexOf(c, l + 1);
              if (a[h]) {
                a[h] === c &&
                  (delete a[h],
                  Object.keys(a).forEach(function (e) {
                    p.parents[e] = !0;
                  }));
                continue;
              }
              a[h] = c;
              var m = p.value;
              typeof m != "string"
                ? (m = f(m))
                : c.fmt && (m = this.tmStrFormat(m, c, e)),
                o.splice.apply(o, [l + 1, Math.max(0, d - l)].concat(m, c)),
                p.indexOf(c) === -1 && p.push(c);
            }
            var g = 0,
              y = 0,
              b = "";
            o.forEach(function (e) {
              if (typeof e == "string") {
                var t = e.split("\n");
                t.length > 1
                  ? ((y = t[t.length - 1].length), (g += t.length - 1))
                  : (y += e.length),
                  (b += e);
              } else e && (e.start ? (e.end = { row: g, column: y }) : (e.start = { row: g, column: y }));
            });
            var w = e.getSelectionRange(),
              E = e.session.replace(w, b),
              S = new v(e),
              x = e.inVirtualSelectionMode && e.selection.index;
            S.addTabstops(u, w.start, E, x);
          }),
          (this.insertSnippet = function (e, t) {
            var n = this;
            if (e.inVirtualSelectionMode)
              return n.insertSnippetForSelection(e, t);
            e.forEachSelection(
              function () {
                n.insertSnippetForSelection(e, t);
              },
              null,
              { keepOrder: !0 }
            ),
              e.tabstopManager && e.tabstopManager.tabNext();
          }),
          (this.$getScope = function (e) {
            var t = e.session.$mode.$id || "";
            t = t.split("/").pop();
            if (t === "html" || t === "php") {
              t === "php" && !e.session.$mode.inlinePhp && (t = "html");
              var n = e.getCursorPosition(),
                r = e.session.getState(n.row);
              typeof r == "object" && (r = r[0]),
                r.substring &&
                  (r.substring(0, 3) == "js-"
                    ? (t = "javascript")
                    : r.substring(0, 4) == "css-"
                    ? (t = "css")
                    : r.substring(0, 4) == "php-" && (t = "php"));
            }
            return t;
          }),
          (this.getActiveScopes = function (e) {
            var t = this.$getScope(e),
              n = [t],
              r = this.snippetMap;
            return (
              r[t] && r[t].includeScopes && n.push.apply(n, r[t].includeScopes),
              n.push("_"),
              n
            );
          }),
          (this.expandWithTab = function (e, t) {
            var n = this,
              r = e.forEachSelection(
                function () {
                  return n.expandSnippetForSelection(e, t);
                },
                null,
                { keepOrder: !0 }
              );
            return r && e.tabstopManager && e.tabstopManager.tabNext(), r;
          }),
          (this.expandSnippetForSelection = function (e, t) {
            var n = e.getCursorPosition(),
              r = e.session.getLine(n.row),
              i = r.substring(0, n.column),
              s = r.substr(n.column),
              o = this.snippetMap,
              u;
            return (
              this.getActiveScopes(e).some(function (e) {
                var t = o[e];
                return t && (u = this.findMatchingSnippet(t, i, s)), !!u;
              }, this),
              u
                ? t && t.dryRun
                  ? !0
                  : (e.session.doc.removeInLine(
                      n.row,
                      n.column - u.replaceBefore.length,
                      n.column + u.replaceAfter.length
                    ),
                    (this.variables.M__ = u.matchBefore),
                    (this.variables.T__ = u.matchAfter),
                    this.insertSnippetForSelection(e, u.content),
                    (this.variables.M__ = this.variables.T__ = null),
                    !0)
                : !1
            );
          }),
          (this.findMatchingSnippet = function (e, t, n) {
            for (var r = e.length; r--; ) {
              var i = e[r];
              if (i.startRe && !i.startRe.test(t)) continue;
              if (i.endRe && !i.endRe.test(n)) continue;
              if (!i.startRe && !i.endRe) continue;
              return (
                (i.matchBefore = i.startRe ? i.startRe.exec(t) : [""]),
                (i.matchAfter = i.endRe ? i.endRe.exec(n) : [""]),
                (i.replaceBefore = i.triggerRe ? i.triggerRe.exec(t)[0] : ""),
                (i.replaceAfter = i.endTriggerRe
                  ? i.endTriggerRe.exec(n)[0]
                  : ""),
                i
              );
            }
          }),
          (this.snippetMap = {}),
          (this.snippetNameMap = {}),
          (this.register = function (e, t) {
            function s(e) {
              return (
                e && !/^\^?\(.*\)\$?$|^\\b$/.test(e) && (e = "(?:" + e + ")"),
                e || ""
              );
            }
            function u(e, t, n) {
              return (
                (e = s(e)),
                (t = s(t)),
                n
                  ? ((e = t + e), e && e[e.length - 1] != "$" && (e += "$"))
                  : ((e += t), e && e[0] != "^" && (e = "^" + e)),
                new RegExp(e)
              );
            }
            function a(e) {
              e.scope || (e.scope = t || "_"),
                (t = e.scope),
                n[t] || ((n[t] = []), (r[t] = {}));
              var s = r[t];
              if (e.name) {
                var a = s[e.name];
                a && i.unregister(a), (s[e.name] = e);
              }
              n[t].push(e),
                e.prefix && (e.tabTrigger = e.prefix),
                !e.content &&
                  e.body &&
                  (e.content = Array.isArray(e.body)
                    ? e.body.join("\n")
                    : e.body),
                e.tabTrigger &&
                  !e.trigger &&
                  (!e.guard && /^\w/.test(e.tabTrigger) && (e.guard = "\\b"),
                  (e.trigger = o.escapeRegExp(e.tabTrigger)));
              if (!e.trigger && !e.guard && !e.endTrigger && !e.endGuard)
                return;
              (e.startRe = u(e.trigger, e.guard, !0)),
                (e.triggerRe = new RegExp(e.trigger)),
                (e.endRe = u(e.endTrigger, e.endGuard, !0)),
                (e.endTriggerRe = new RegExp(e.endTrigger));
            }
            var n = this.snippetMap,
              r = this.snippetNameMap,
              i = this;
            e || (e = []),
              Array.isArray(e)
                ? e.forEach(a)
                : Object.keys(e).forEach(function (t) {
                    a(e[t]);
                  }),
              this._signal("registerSnippets", { scope: t });
          }),
          (this.unregister = function (e, t) {
            function i(e) {
              var i = r[e.scope || t];
              if (i && i[e.name]) {
                delete i[e.name];
                var s = n[e.scope || t],
                  o = s && s.indexOf(e);
                o >= 0 && s.splice(o, 1);
              }
            }
            var n = this.snippetMap,
              r = this.snippetNameMap;
            e.content ? i(e) : Array.isArray(e) && e.forEach(i);
          }),
          (this.parseSnippetFile = function (e) {
            e = e.replace(/\r/g, "");
            var t = [],
              n = {},
              r = /^#.*|^({[\s\S]*})\s*$|^(\S+) (.*)$|^((?:\n*\t.*)+)/gm,
              i;
            while ((i = r.exec(e))) {
              if (i[1])
                try {
                  (n = JSON.parse(i[1])), t.push(n);
                } catch (s) {}
              if (i[4])
                (n.content = i[4].replace(/^\t/gm, "")), t.push(n), (n = {});
              else {
                var o = i[2],
                  u = i[3];
                if (o == "regex") {
                  var a = /\/((?:[^\/\\]|\\.)*)|$/g;
                  (n.guard = a.exec(u)[1]),
                    (n.trigger = a.exec(u)[1]),
                    (n.endTrigger = a.exec(u)[1]),
                    (n.endGuard = a.exec(u)[1]);
                } else
                  o == "snippet"
                    ? ((n.tabTrigger = u.match(/^\S*/)[0]),
                      n.name || (n.name = u))
                    : o && (n[o] = u);
              }
            }
            return t;
          }),
          (this.getSnippetByName = function (e, t) {
            var n = this.snippetNameMap,
              r;
            return (
              this.getActiveScopes(t).some(function (t) {
                var i = n[t];
                return i && (r = i[e]), !!r;
              }, this),
              r
            );
          });
      }.call(d.prototype));
      var v = function (e) {
        if (e.tabstopManager) return e.tabstopManager;
        (e.tabstopManager = this),
          (this.$onChange = this.onChange.bind(this)),
          (this.$onChangeSelection = o.delayedCall(
            this.onChangeSelection.bind(this)
          ).schedule),
          (this.$onChangeSession = this.onChangeSession.bind(this)),
          (this.$onAfterExec = this.onAfterExec.bind(this)),
          this.attach(e);
      };
      (function () {
        (this.attach = function (e) {
          (this.index = 0),
            (this.ranges = []),
            (this.tabstops = []),
            (this.$openTabstops = null),
            (this.selectedTabstop = null),
            (this.editor = e),
            this.editor.on("change", this.$onChange),
            this.editor.on("changeSelection", this.$onChangeSelection),
            this.editor.on("changeSession", this.$onChangeSession),
            this.editor.commands.on("afterExec", this.$onAfterExec),
            this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
        }),
          (this.detach = function () {
            this.tabstops.forEach(this.removeTabstopMarkers, this),
              (this.ranges = null),
              (this.tabstops = null),
              (this.selectedTabstop = null),
              this.editor.removeListener("change", this.$onChange),
              this.editor.removeListener(
                "changeSelection",
                this.$onChangeSelection
              ),
              this.editor.removeListener(
                "changeSession",
                this.$onChangeSession
              ),
              this.editor.commands.removeListener(
                "afterExec",
                this.$onAfterExec
              ),
              this.editor.keyBinding.removeKeyboardHandler(
                this.keyboardHandler
              ),
              (this.editor.tabstopManager = null),
              (this.editor = null);
          }),
          (this.onChange = function (e) {
            var t = e.action[0] == "r",
              n = this.selectedTabstop || {},
              r = n.parents || {},
              i = (this.tabstops || []).slice();
            for (var s = 0; s < i.length; s++) {
              var o = i[s],
                u = o == n || r[o.index];
              o.rangeList.$bias = u ? 0 : 1;
              if (e.action == "remove" && o !== n) {
                var a = o.parents && o.parents[n.index],
                  f = o.rangeList.pointIndex(e.start, a);
                f = f < 0 ? -f - 1 : f + 1;
                var l = o.rangeList.pointIndex(e.end, a);
                l = l < 0 ? -l - 1 : l - 1;
                var c = o.rangeList.ranges.slice(f, l);
                for (var h = 0; h < c.length; h++) this.removeRange(c[h]);
              }
              o.rangeList.$onChange(e);
            }
            var p = this.editor.session;
            !this.$inChange &&
              t &&
              p.getLength() == 1 &&
              !p.getValue() &&
              this.detach();
          }),
          (this.updateLinkedFields = function () {
            var e = this.selectedTabstop;
            if (!e || !e.hasLinkedRanges || !e.firstNonLinked) return;
            this.$inChange = !0;
            var n = this.editor.session,
              r = n.getTextRange(e.firstNonLinked);
            for (var i = 0; i < e.length; i++) {
              var s = e[i];
              if (!s.linked) continue;
              var o = s.original,
                u = t.snippetManager.tmStrFormat(r, o, this.editor);
              n.replace(s, u);
            }
            this.$inChange = !1;
          }),
          (this.onAfterExec = function (e) {
            e.command && !e.command.readOnly && this.updateLinkedFields();
          }),
          (this.onChangeSelection = function () {
            if (!this.editor) return;
            var e = this.editor.selection.lead,
              t = this.editor.selection.anchor,
              n = this.editor.selection.isEmpty();
            for (var r = 0; r < this.ranges.length; r++) {
              if (this.ranges[r].linked) continue;
              var i = this.ranges[r].contains(e.row, e.column),
                s = n || this.ranges[r].contains(t.row, t.column);
              if (i && s) return;
            }
            this.detach();
          }),
          (this.onChangeSession = function () {
            this.detach();
          }),
          (this.tabNext = function (e) {
            var t = this.tabstops.length,
              n = this.index + (e || 1);
            (n = Math.min(Math.max(n, 1), t)),
              n == t && (n = 0),
              this.selectTabstop(n),
              n === 0 && this.detach();
          }),
          (this.selectTabstop = function (e) {
            this.$openTabstops = null;
            var t = this.tabstops[this.index];
            t && this.addTabstopMarkers(t),
              (this.index = e),
              (t = this.tabstops[this.index]);
            if (!t || !t.length) return;
            this.selectedTabstop = t;
            var n = t.firstNonLinked || t;
            t.choices && (n.cursor = n.start);
            if (!this.editor.inVirtualSelectionMode) {
              var r = this.editor.multiSelect;
              r.toSingleRange(n);
              for (var i = 0; i < t.length; i++) {
                if (t.hasLinkedRanges && t[i].linked) continue;
                r.addRange(t[i].clone(), !0);
              }
            } else this.editor.selection.fromOrientedRange(n);
            this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler),
              this.selectedTabstop &&
                this.selectedTabstop.choices &&
                this.editor.execCommand("startAutocomplete", {
                  matches: this.selectedTabstop.choices,
                });
          }),
          (this.addTabstops = function (e, t, n) {
            var r = this.useLink || !this.editor.getOption("enableMultiselect");
            this.$openTabstops || (this.$openTabstops = []);
            if (!e[0]) {
              var i = u.fromPoints(n, n);
              g(i.start, t), g(i.end, t), (e[0] = [i]), (e[0].index = 0);
            }
            var s = this.index,
              o = [s + 1, 0],
              f = this.ranges;
            e.forEach(function (e, n) {
              var i = this.$openTabstops[n] || e;
              for (var s = 0; s < e.length; s++) {
                var l = e[s],
                  c = u.fromPoints(l.start, l.end || l.start);
                m(c.start, t),
                  m(c.end, t),
                  (c.original = l),
                  (c.tabstop = i),
                  f.push(c),
                  i != e ? i.unshift(c) : (i[s] = c),
                  l.fmtString || (i.firstNonLinked && r)
                    ? ((c.linked = !0), (i.hasLinkedRanges = !0))
                    : i.firstNonLinked || (i.firstNonLinked = c);
              }
              i.firstNonLinked || (i.hasLinkedRanges = !1),
                i === e && (o.push(i), (this.$openTabstops[n] = i)),
                this.addTabstopMarkers(i),
                (i.rangeList = i.rangeList || new a()),
                (i.rangeList.$bias = 0),
                i.rangeList.addList(i);
            }, this),
              o.length > 2 &&
                (this.tabstops.length && o.push(o.splice(2, 1)[0]),
                this.tabstops.splice.apply(this.tabstops, o));
          }),
          (this.addTabstopMarkers = function (e) {
            var t = this.editor.session;
            e.forEach(function (e) {
              e.markerId ||
                (e.markerId = t.addMarker(e, "ace_snippet-marker", "text"));
            });
          }),
          (this.removeTabstopMarkers = function (e) {
            var t = this.editor.session;
            e.forEach(function (e) {
              t.removeMarker(e.markerId), (e.markerId = null);
            });
          }),
          (this.removeRange = function (e) {
            var t = e.tabstop.indexOf(e);
            t != -1 && e.tabstop.splice(t, 1),
              (t = this.ranges.indexOf(e)),
              t != -1 && this.ranges.splice(t, 1),
              (t = e.tabstop.rangeList.ranges.indexOf(e)),
              t != -1 && e.tabstop.splice(t, 1),
              this.editor.session.removeMarker(e.markerId),
              e.tabstop.length ||
                ((t = this.tabstops.indexOf(e.tabstop)),
                t != -1 && this.tabstops.splice(t, 1),
                this.tabstops.length || this.detach());
          }),
          (this.keyboardHandler = new f()),
          this.keyboardHandler.bindKeys({
            Tab: function (e) {
              if (t.snippetManager && t.snippetManager.expandWithTab(e)) return;
              e.tabstopManager.tabNext(1), e.renderer.scrollCursorIntoView();
            },
            "Shift-Tab": function (e) {
              e.tabstopManager.tabNext(-1), e.renderer.scrollCursorIntoView();
            },
            Esc: function (e) {
              e.tabstopManager.detach();
            },
          });
      }.call(v.prototype));
      var m = function (e, t) {
          e.row == 0 && (e.column += t.column), (e.row += t.row);
        },
        g = function (e, t) {
          e.row == t.row && (e.column -= t.column), (e.row -= t.row);
        };
      r.importCssString(
        "\n.ace_snippet-marker {\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n    background: rgba(194, 193, 208, 0.09);\n    border: 1px dotted rgba(211, 208, 235, 0.62);\n    position: absolute;\n}",
        "snippets.css",
        !1
      ),
        (t.snippetManager = new d());
      var y = e("./editor").Editor;
      (function () {
        (this.insertSnippet = function (e, n) {
          return t.snippetManager.insertSnippet(this, e, n);
        }),
          (this.expandSnippet = function (e) {
            return t.snippetManager.expandWithTab(this, e);
          });
      }.call(y.prototype));
    }
  ),
  define(
    "ace/autocomplete",
    [
      "require",
      "exports",
      "module",
      "ace/keyboard/hash_handler",
      "ace/autocomplete/popup",
      "ace/autocomplete/util",
      "ace/lib/lang",
      "ace/lib/dom",
      "ace/snippets",
      "ace/config",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("./keyboard/hash_handler").HashHandler,
        i = e("./autocomplete/popup").AcePopup,
        s = e("./autocomplete/util"),
        o = e("./lib/lang"),
        u = e("./lib/dom"),
        a = e("./snippets").snippetManager,
        f = e("./config"),
        l = function () {
          (this.autoInsert = !1),
            (this.autoSelect = !0),
            (this.exactMatch = !1),
            (this.gatherCompletionsId = 0),
            (this.keyboardHandler = new r()),
            this.keyboardHandler.bindKeys(this.commands),
            (this.blurListener = this.blurListener.bind(this)),
            (this.changeListener = this.changeListener.bind(this)),
            (this.mousedownListener = this.mousedownListener.bind(this)),
            (this.mousewheelListener = this.mousewheelListener.bind(this)),
            (this.changeTimer = o.delayedCall(
              function () {
                this.updateCompletions(!0);
              }.bind(this)
            )),
            (this.tooltipTimer = o.delayedCall(
              this.updateDocTooltip.bind(this),
              50
            ));
        };
      (function () {
        (this.$init = function () {
          return (
            (this.popup = new i(document.body || document.documentElement)),
            this.popup.on(
              "click",
              function (e) {
                this.insertMatch(), e.stop();
              }.bind(this)
            ),
            (this.popup.focus = this.editor.focus.bind(this.editor)),
            this.popup.on("show", this.tooltipTimer.bind(null, null)),
            this.popup.on("select", this.tooltipTimer.bind(null, null)),
            this.popup.on(
              "changeHoverMarker",
              this.tooltipTimer.bind(null, null)
            ),
            this.popup
          );
        }),
          (this.getPopup = function () {
            return this.popup || this.$init();
          }),
          (this.openPopup = function (e, t, n) {
            this.popup || this.$init(),
              (this.popup.autoSelect = this.autoSelect),
              this.popup.setData(
                this.completions.filtered,
                this.completions.filterText
              ),
              e.keyBinding.addKeyboardHandler(this.keyboardHandler);
            var r = e.renderer;
            this.popup.setRow(this.autoSelect ? 0 : -1);
            if (!n) {
              this.popup.setTheme(e.getTheme()),
                this.popup.setFontSize(e.getFontSize());
              var i = r.layerConfig.lineHeight,
                s = r.$cursorLayer.getPixelPosition(this.base, !0);
              s.left -= this.popup.getTextLeftOffset();
              var o = e.container.getBoundingClientRect();
              (s.top += o.top - r.layerConfig.offset),
                (s.left += o.left - e.renderer.scrollLeft),
                (s.left += r.gutterWidth),
                this.popup.show(s, i);
            } else n && !t && this.detach();
            this.changeTimer.cancel();
          }),
          (this.detach = function () {
            this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler),
              this.editor.off("changeSelection", this.changeListener),
              this.editor.off("blur", this.blurListener),
              this.editor.off("mousedown", this.mousedownListener),
              this.editor.off("mousewheel", this.mousewheelListener),
              this.changeTimer.cancel(),
              this.hideDocTooltip(),
              (this.gatherCompletionsId += 1),
              this.popup && this.popup.isOpen && this.popup.hide(),
              this.base && this.base.detach(),
              (this.activated = !1),
              (this.completions = this.base = null);
          }),
          (this.changeListener = function (e) {
            var t = this.editor.selection.lead;
            (t.row != this.base.row || t.column < this.base.column) &&
              this.detach(),
              this.activated ? this.changeTimer.schedule() : this.detach();
          }),
          (this.blurListener = function (e) {
            var t = document.activeElement,
              n = this.editor.textInput.getElement(),
              r =
                e.relatedTarget &&
                this.tooltipNode &&
                this.tooltipNode.contains(e.relatedTarget),
              i = this.popup && this.popup.container;
            t != n &&
              t.parentNode != i &&
              !r &&
              t != this.tooltipNode &&
              e.relatedTarget != n &&
              this.detach();
          }),
          (this.mousedownListener = function (e) {
            this.detach();
          }),
          (this.mousewheelListener = function (e) {
            this.detach();
          }),
          (this.goTo = function (e) {
            this.popup.goTo(e);
          }),
          (this.insertMatch = function (e, t) {
            e || (e = this.popup.getData(this.popup.getRow()));
            if (!e) return !1;
            var n = this.completions;
            this.editor.startOperation({ command: { name: "insertMatch" } });
            if (e.completer && e.completer.insertMatch)
              e.completer.insertMatch(this.editor, e);
            else {
              if (!n) return !1;
              if (n.filterText) {
                var r = this.editor.selection.getAllRanges();
                for (var i = 0, s; (s = r[i]); i++)
                  (s.start.column -= n.filterText.length),
                    this.editor.session.remove(s);
              }
              e.snippet
                ? a.insertSnippet(this.editor, e.snippet)
                : this.editor.execCommand("insertstring", e.value || e);
            }
            this.completions == n && this.detach(), this.editor.endOperation();
          }),
          (this.commands = {
            Up: function (e) {
              e.completer.goTo("up");
            },
            Down: function (e) {
              e.completer.goTo("down");
            },
            "Ctrl-Up|Ctrl-Home": function (e) {
              e.completer.goTo("start");
            },
            "Ctrl-Down|Ctrl-End": function (e) {
              e.completer.goTo("end");
            },
            Esc: function (e) {
              e.completer.detach();
            },
            Return: function (e) {
              return e.completer.insertMatch();
            },
            "Shift-Return": function (e) {
              e.completer.insertMatch(null, { deleteSuffix: !0 });
            },
            Tab: function (e) {
              var t = e.completer.insertMatch();
              if (!!t || !!e.tabstopManager) return t;
              e.completer.goTo("down");
            },
            PageUp: function (e) {
              e.completer.popup.gotoPageUp();
            },
            PageDown: function (e) {
              e.completer.popup.gotoPageDown();
            },
          }),
          (this.gatherCompletions = function (e, t) {
            var n = e.getSession(),
              r = e.getCursorPosition(),
              i = s.getCompletionPrefix(e);
            (this.base = n.doc.createAnchor(r.row, r.column - i.length)),
              (this.base.$insertRight = !0);
            var o = [],
              u = e.completers.length;
            return (
              e.completers.forEach(function (a, f) {
                a.getCompletions(e, n, r, i, function (n, r) {
                  !n && r && (o = o.concat(r)),
                    t(null, {
                      prefix: s.getCompletionPrefix(e),
                      matches: o,
                      finished: --u === 0,
                    });
                });
              }),
              !0
            );
          }),
          (this.showPopup = function (e, t) {
            this.editor && this.detach(),
              (this.activated = !0),
              (this.editor = e),
              e.completer != this &&
                (e.completer && e.completer.detach(), (e.completer = this)),
              e.on("changeSelection", this.changeListener),
              e.on("blur", this.blurListener),
              e.on("mousedown", this.mousedownListener),
              e.on("mousewheel", this.mousewheelListener),
              this.updateCompletions(!1, t);
          }),
          (this.updateCompletions = function (e, t) {
            if (e && this.base && this.completions) {
              var n = this.editor.getCursorPosition(),
                r = this.editor.session.getTextRange({
                  start: this.base,
                  end: n,
                });
              if (r == this.completions.filterText) return;
              this.completions.setFilter(r);
              if (!this.completions.filtered.length) return this.detach();
              if (
                this.completions.filtered.length == 1 &&
                this.completions.filtered[0].value == r &&
                !this.completions.filtered[0].snippet
              )
                return this.detach();
              this.openPopup(this.editor, r, e);
              return;
            }
            if (t && t.matches) {
              var n = this.editor.getSelectionRange().start;
              return (
                (this.base = this.editor.session.doc.createAnchor(
                  n.row,
                  n.column
                )),
                (this.base.$insertRight = !0),
                (this.completions = new c(t.matches)),
                this.openPopup(this.editor, "", e)
              );
            }
            var i = this.gatherCompletionsId,
              s = function (e) {
                if (!e.finished) return;
                return this.detach();
              }.bind(this),
              o = function (t) {
                var n = t.prefix,
                  r = t.matches;
                (this.completions = new c(r)),
                  this.exactMatch && (this.completions.exactMatch = !0),
                  this.completions.setFilter(n);
                var i = this.completions.filtered;
                if (!i.length) return s(t);
                if (i.length == 1 && i[0].value == n && !i[0].snippet)
                  return s(t);
                if (this.autoInsert && i.length == 1 && t.finished)
                  return this.insertMatch(i[0]);
                this.openPopup(this.editor, n, e);
              }.bind(this),
              u = !0,
              a = null;
            this.gatherCompletions(
              this.editor,
              function (e, t) {
                var n = t.prefix,
                  r = t && t.matches;
                if (!r || !r.length) return s(t);
                if (n.indexOf(t.prefix) !== 0 || i != this.gatherCompletionsId)
                  return;
                if (u) {
                  a = t;
                  return;
                }
                o(t);
              }.bind(this)
            ),
              (u = !1);
            if (a) {
              var f = a;
              (a = null), o(f);
            }
          }),
          (this.cancelContextMenu = function () {
            this.editor.$mouseHandler.cancelContextMenu();
          }),
          (this.updateDocTooltip = function () {
            var e = this.popup,
              t = e.data,
              n = t && (t[e.getHoveredRow()] || t[e.getRow()]),
              r = null;
            if (!n || !this.editor || !this.popup.isOpen)
              return this.hideDocTooltip();
            this.editor.completers.some(function (e) {
              return e.getDocTooltip && (r = e.getDocTooltip(n)), r;
            }),
              !r && typeof n != "string" && (r = n),
              typeof r == "string" && (r = { docText: r });
            if (!r || (!r.docHTML && !r.docText)) return this.hideDocTooltip();
            this.showDocTooltip(r);
          }),
          (this.showDocTooltip = function (e) {
            this.tooltipNode ||
              ((this.tooltipNode = u.createElement("div")),
              (this.tooltipNode.className = "ace_tooltip ace_doc-tooltip"),
              (this.tooltipNode.style.margin = 0),
              (this.tooltipNode.style.pointerEvents = "auto"),
              (this.tooltipNode.tabIndex = -1),
              (this.tooltipNode.onblur = this.blurListener.bind(this)),
              (this.tooltipNode.onclick = this.onTooltipClick.bind(this)));
            var t = this.tooltipNode;
            e.docHTML
              ? (t.innerHTML = e.docHTML)
              : e.docText && (t.textContent = e.docText),
              t.parentNode || document.body.appendChild(t);
            var n = this.popup,
              r = n.container.getBoundingClientRect();
            (t.style.top = n.container.style.top),
              (t.style.bottom = n.container.style.bottom),
              (t.style.display = "block"),
              window.innerWidth - r.right < 320
                ? r.left < 320
                  ? n.isTopdown
                    ? ((t.style.top = r.bottom + "px"),
                      (t.style.left = r.left + "px"),
                      (t.style.right = ""),
                      (t.style.bottom = ""))
                    : ((t.style.top =
                        n.container.offsetTop - t.offsetHeight + "px"),
                      (t.style.left = r.left + "px"),
                      (t.style.right = ""),
                      (t.style.bottom = ""))
                  : ((t.style.right = window.innerWidth - r.left + "px"),
                    (t.style.left = ""))
                : ((t.style.left = r.right + 1 + "px"), (t.style.right = ""));
          }),
          (this.hideDocTooltip = function () {
            this.tooltipTimer.cancel();
            if (!this.tooltipNode) return;
            var e = this.tooltipNode;
            !this.editor.isFocused() &&
              document.activeElement == e &&
              this.editor.focus(),
              (this.tooltipNode = null),
              e.parentNode && e.parentNode.removeChild(e);
          }),
          (this.onTooltipClick = function (e) {
            var t = e.target;
            while (t && t != this.tooltipNode) {
              if (t.nodeName == "A" && t.href) {
                (t.rel = "noreferrer"), (t.target = "_blank");
                break;
              }
              t = t.parentNode;
            }
          }),
          (this.destroy = function () {
            this.detach();
            if (this.popup) {
              this.popup.destroy();
              var e = this.popup.container;
              e && e.parentNode && e.parentNode.removeChild(e);
            }
            this.editor &&
              this.editor.completer == this &&
              this.editor.completer == null,
              (this.popup = null);
          });
      }.call(l.prototype),
        (l.for = function (e) {
          return e.completer
            ? e.completer
            : (f.get("sharedPopups")
                ? (l.$shared || (l.$sharedInstance = new l()),
                  (e.completer = l.$sharedInstance))
                : ((e.completer = new l()),
                  e.once("destroy", function (e, t) {
                    t.completer.destroy();
                  })),
              e.completer);
        }),
        (l.startCommand = {
          name: "startAutocomplete",
          exec: function (e, t) {
            var n = l.for(e);
            (n.autoInsert = !1),
              (n.autoSelect = !0),
              n.showPopup(e, t),
              n.cancelContextMenu();
          },
          bindKey: "Ctrl-Space|Ctrl-Shift-Space|Alt-Space",
        }));
      var c = function (e, t) {
        (this.all = e),
          (this.filtered = e),
          (this.filterText = t || ""),
          (this.exactMatch = !1);
      };
      (function () {
        (this.setFilter = function (e) {
          if (
            e.length > this.filterText &&
            e.lastIndexOf(this.filterText, 0) === 0
          )
            var t = this.filtered;
          else var t = this.all;
          (this.filterText = e),
            (t = this.filterCompletions(t, this.filterText)),
            (t = t.sort(function (e, t) {
              return (
                t.exactMatch - e.exactMatch ||
                t.$score - e.$score ||
                (e.caption || e.value).localeCompare(t.caption || t.value)
              );
            }));
          var n = null;
          (t = t.filter(function (e) {
            var t = e.snippet || e.caption || e.value;
            return t === n ? !1 : ((n = t), !0);
          })),
            (this.filtered = t);
        }),
          (this.filterCompletions = function (e, t) {
            var n = [],
              r = t.toUpperCase(),
              i = t.toLowerCase();
            e: for (var s = 0, o; (o = e[s]); s++) {
              var u = o.caption || o.value || o.snippet;
              if (!u) continue;
              var a = -1,
                f = 0,
                l = 0,
                c,
                h;
              if (this.exactMatch) {
                if (t !== u.substr(0, t.length)) continue e;
              } else {
                var p = u.toLowerCase().indexOf(i);
                if (p > -1) l = p;
                else
                  for (var d = 0; d < t.length; d++) {
                    var v = u.indexOf(i[d], a + 1),
                      m = u.indexOf(r[d], a + 1);
                    c = v >= 0 ? (m < 0 || v < m ? v : m) : m;
                    if (c < 0) continue e;
                    (h = c - a - 1),
                      h > 0 && (a === -1 && (l += 10), (l += h), (f |= 1 << d)),
                      (a = c);
                  }
              }
              (o.matchMask = f),
                (o.exactMatch = l ? 0 : 1),
                (o.$score = (o.score || 0) - l),
                n.push(o);
            }
            return n;
          });
      }.call(c.prototype),
        (t.Autocomplete = l),
        (t.FilteredList = c));
    }
  ),
  define(
    "ace/ext/menu_tools/settings_menu.css",
    ["require", "exports", "module"],
    function (e, t, n) {
      n.exports =
        "#ace_settingsmenu, #kbshortcutmenu {\n    background-color: #F7F7F7;\n    color: black;\n    box-shadow: -5px 4px 5px rgba(126, 126, 126, 0.55);\n    padding: 1em 0.5em 2em 1em;\n    overflow: auto;\n    position: absolute;\n    margin: 0;\n    bottom: 0;\n    right: 0;\n    top: 0;\n    z-index: 9991;\n    cursor: default;\n}\n\n.ace_dark #ace_settingsmenu, .ace_dark #kbshortcutmenu {\n    box-shadow: -20px 10px 25px rgba(126, 126, 126, 0.25);\n    background-color: rgba(255, 255, 255, 0.6);\n    color: black;\n}\n\n.ace_optionsMenuEntry:hover {\n    background-color: rgba(100, 100, 100, 0.1);\n    transition: all 0.3s\n}\n\n.ace_closeButton {\n    background: rgba(245, 146, 146, 0.5);\n    border: 1px solid #F48A8A;\n    border-radius: 50%;\n    padding: 7px;\n    position: absolute;\n    right: -8px;\n    top: -8px;\n    z-index: 100000;\n}\n.ace_closeButton{\n    background: rgba(245, 146, 146, 0.9);\n}\n.ace_optionsMenuKey {\n    color: darkslateblue;\n    font-weight: bold;\n}\n.ace_optionsMenuCommand {\n    color: darkcyan;\n    font-weight: normal;\n}\n.ace_optionsMenuEntry input, .ace_optionsMenuEntry button {\n    vertical-align: middle;\n}\n\n.ace_optionsMenuEntry button[ace_selected_button=true] {\n    background: #e7e7e7;\n    box-shadow: 1px 0px 2px 0px #adadad inset;\n    border-color: #adadad;\n}\n.ace_optionsMenuEntry button {\n    background: white;\n    border: 1px solid lightgray;\n    margin: 0px;\n}\n.ace_optionsMenuEntry button:hover{\n    background: #f0f0f0;\n}";
    }
  ),
  define(
    "ace/ext/menu_tools/overlay_page",
    [
      "require",
      "exports",
      "module",
      "ace/lib/dom",
      "ace/ext/menu_tools/settings_menu.css",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../../lib/dom"),
        i = e("./settings_menu.css");
      r.importCssString(i, "settings_menu.css", !1),
        (n.exports.overlayPage = function (t, n, r) {
          function o(e) {
            e.keyCode === 27 && u();
          }
          function u() {
            if (!i) return;
            document.removeEventListener("keydown", o),
              i.parentNode.removeChild(i),
              t && t.focus(),
              (i = null),
              r && r();
          }
          function a(e) {
            (s = e),
              e &&
                ((i.style.pointerEvents = "none"),
                (n.style.pointerEvents = "auto"));
          }
          var i = document.createElement("div"),
            s = !1;
          return (
            (i.style.cssText =
              "margin: 0; padding: 0; position: fixed; top:0; bottom:0; left:0; right:0;z-index: 9990; " +
              (t ? "background-color: rgba(0, 0, 0, 0.3);" : "")),
            i.addEventListener("click", function (e) {
              s || u();
            }),
            document.addEventListener("keydown", o),
            n.addEventListener("click", function (e) {
              e.stopPropagation();
            }),
            i.appendChild(n),
            document.body.appendChild(i),
            t && t.blur(),
            { close: u, setIgnoreFocusOut: a }
          );
        });
    }
  ),
  define(
    "ace/ext/modelist",
    ["require", "exports", "module"],
    function (e, t, n) {
      "use strict";
      function i(e) {
        var t = a.text,
          n = e.split(/[\/\\]/).pop();
        for (var i = 0; i < r.length; i++)
          if (r[i].supportsFile(n)) {
            t = r[i];
            break;
          }
        return t;
      }
      var r = [],
        s = function (e, t, n) {
          (this.name = e),
            (this.caption = t),
            (this.mode = "ace/mode/" + e),
            (this.extensions = n);
          var r;
          /\^/.test(n)
            ? (r =
                n.replace(/\|(\^)?/g, function (e, t) {
                  return "$|" + (t ? "^" : "^.*\\.");
                }) + "$")
            : (r = "^.*\\.(" + n + ")$"),
            (this.extRe = new RegExp(r, "gi"));
        };
      s.prototype.supportsFile = function (e) {
        return e.match(this.extRe);
      };
      var o = {
          ABAP: ["abap"],
          ABC: ["abc"],
          ActionScript: ["as"],
          ADA: ["ada|adb"],
          Alda: ["alda"],
          Apache_Conf: [
            "^htaccess|^htgroups|^htpasswd|^conf|htaccess|htgroups|htpasswd",
          ],
          Apex: ["apex|cls|trigger|tgr"],
          AQL: ["aql"],
          AsciiDoc: ["asciidoc|adoc"],
          ASL: ["dsl|asl|asl.json"],
          Assembly_x86: ["asm|a"],
          AutoHotKey: ["ahk"],
          BatchFile: ["bat|cmd"],
          BibTeX: ["bib"],
          C_Cpp: ["cpp|c|cc|cxx|h|hh|hpp|ino"],
          C9Search: ["c9search_results"],
          Cirru: ["cirru|cr"],
          Clojure: ["clj|cljs"],
          Cobol: ["CBL|COB"],
          coffee: ["coffee|cf|cson|^Cakefile"],
          ColdFusion: ["cfm"],
          Crystal: ["cr"],
          CSharp: ["cs"],
          Csound_Document: ["csd"],
          Csound_Orchestra: ["orc"],
          Csound_Score: ["sco"],
          CSS: ["css"],
          Curly: ["curly"],
          D: ["d|di"],
          Dart: ["dart"],
          Diff: ["diff|patch"],
          Dockerfile: ["^Dockerfile"],
          Dot: ["dot"],
          Drools: ["drl"],
          Edifact: ["edi"],
          Eiffel: ["e|ge"],
          EJS: ["ejs"],
          Elixir: ["ex|exs"],
          Elm: ["elm"],
          Erlang: ["erl|hrl"],
          Forth: ["frt|fs|ldr|fth|4th"],
          Fortran: ["f|f90"],
          FSharp: ["fsi|fs|ml|mli|fsx|fsscript"],
          FSL: ["fsl"],
          FTL: ["ftl"],
          Gcode: ["gcode"],
          Gherkin: ["feature"],
          Gitignore: ["^.gitignore"],
          Glsl: ["glsl|frag|vert"],
          Gobstones: ["gbs"],
          golang: ["go"],
          GraphQLSchema: ["gql"],
          Groovy: ["groovy"],
          HAML: ["haml"],
          Handlebars: ["hbs|handlebars|tpl|mustache"],
          Haskell: ["hs"],
          Haskell_Cabal: ["cabal"],
          haXe: ["hx"],
          Hjson: ["hjson"],
          HTML: ["html|htm|xhtml|vue|we|wpy"],
          HTML_Elixir: ["eex|html.eex"],
          HTML_Ruby: ["erb|rhtml|html.erb"],
          INI: ["ini|conf|cfg|prefs"],
          Io: ["io"],
          Ion: ["ion"],
          Jack: ["jack"],
          Jade: ["jade|pug"],
          Java: ["java"],
          JavaScript: ["js|jsm|jsx|cjs|mjs"],
          JSON: ["json"],
          JSON5: ["json5"],
          JSONiq: ["jq"],
          JSP: ["jsp"],
          JSSM: ["jssm|jssm_state"],
          JSX: ["jsx"],
          Julia: ["jl"],
          Kotlin: ["kt|kts"],
          LaTeX: ["tex|latex|ltx|bib"],
          Latte: ["latte"],
          LESS: ["less"],
          Liquid: ["liquid"],
          Lisp: ["lisp"],
          LiveScript: ["ls"],
          Log: ["log"],
          LogiQL: ["logic|lql"],
          Logtalk: ["lgt"],
          LSL: ["lsl"],
          Lua: ["lua"],
          LuaPage: ["lp"],
          Lucene: ["lucene"],
          Makefile: ["^Makefile|^GNUmakefile|^makefile|^OCamlMakefile|make"],
          Markdown: ["md|markdown"],
          Mask: ["mask"],
          MATLAB: ["matlab"],
          Maze: ["mz"],
          MediaWiki: ["wiki|mediawiki"],
          MEL: ["mel"],
          MIPS: ["s|asm"],
          MIXAL: ["mixal"],
          MUSHCode: ["mc|mush"],
          MySQL: ["mysql"],
          Nginx: ["nginx|conf"],
          Nim: ["nim"],
          Nix: ["nix"],
          NSIS: ["nsi|nsh"],
          Nunjucks: ["nunjucks|nunjs|nj|njk"],
          ObjectiveC: ["m|mm"],
          OCaml: ["ml|mli"],
          PartiQL: ["partiql|pql"],
          Pascal: ["pas|p"],
          Perl: ["pl|pm"],
          pgSQL: ["pgsql"],
          PHP_Laravel_blade: ["blade.php"],
          PHP: ["php|inc|phtml|shtml|php3|php4|php5|phps|phpt|aw|ctp|module"],
          Pig: ["pig"],
          Powershell: ["ps1"],
          Praat: ["praat|praatscript|psc|proc"],
          Prisma: ["prisma"],
          Prolog: ["plg|prolog"],
          Properties: ["properties"],
          Protobuf: ["proto"],
          Puppet: ["epp|pp"],
          Python: ["py"],
          QML: ["qml"],
          R: ["r"],
          Raku: ["raku|rakumod|rakutest|p6|pl6|pm6"],
          Razor: ["cshtml|asp"],
          RDoc: ["Rd"],
          Red: ["red|reds"],
          RHTML: ["Rhtml"],
          Robot: ["robot|resource"],
          RST: ["rst"],
          Ruby: ["rb|ru|gemspec|rake|^Guardfile|^Rakefile|^Gemfile"],
          Rust: ["rs"],
          SaC: ["sac"],
          SASS: ["sass"],
          SCAD: ["scad"],
          Scala: ["scala|sbt"],
          Scheme: ["scm|sm|rkt|oak|scheme"],
          Scrypt: ["scrypt"],
          SCSS: ["scss"],
          SH: ["sh|bash|^.bashrc"],
          SJS: ["sjs"],
          Slim: ["slim|skim"],
          Smarty: ["smarty|tpl"],
          Smithy: ["smithy"],
          snippets: ["snippets"],
          Soy_Template: ["soy"],
          Space: ["space"],
          SPARQL: ["rq"],
          SQL: ["sql"],
          SQLServer: ["sqlserver"],
          Stylus: ["styl|stylus"],
          SVG: ["svg"],
          Swift: ["swift"],
          Tcl: ["tcl"],
          Terraform: ["tf", "tfvars", "terragrunt"],
          Tex: ["tex"],
          Text: ["txt"],
          Textile: ["textile"],
          Toml: ["toml"],
          TSX: ["tsx"],
          Turtle: ["ttl"],
          Twig: ["twig|swig"],
          Typescript: ["ts|typescript|str"],
          Vala: ["vala"],
          VBScript: ["vbs|vb"],
          Velocity: ["vm"],
          Verilog: ["v|vh|sv|svh"],
          VHDL: ["vhd|vhdl"],
          Visualforce: ["vfp|component|page"],
          Wollok: ["wlk|wpgm|wtest"],
          XML: ["xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl|xaml"],
          XQuery: ["xq"],
          YAML: ["yaml|yml"],
          Zeek: ["zeek|bro"],
          Django: ["html"],
        },
        u = {
          ObjectiveC: "Objective-C",
          CSharp: "C#",
          golang: "Go",
          C_Cpp: "C and C++",
          Csound_Document: "Csound Document",
          Csound_Orchestra: "Csound",
          Csound_Score: "Csound Score",
          coffee: "CoffeeScript",
          HTML_Ruby: "HTML (Ruby)",
          HTML_Elixir: "HTML (Elixir)",
          FTL: "FreeMarker",
          PHP_Laravel_blade: "PHP (Blade Template)",
          Perl6: "Perl 6",
          AutoHotKey: "AutoHotkey / AutoIt",
        },
        a = {};
      for (var f in o) {
        var l = o[f],
          c = (u[f] || f).replace(/_/g, " "),
          h = f.toLowerCase(),
          p = new s(h, c, l[0]);
        (a[h] = p), r.push(p);
      }
      n.exports = { getModeForPath: i, modes: r, modesByName: a };
    }
  ),
  define(
    "ace/ext/prompt",
    [
      "require",
      "exports",
      "module",
      "ace/range",
      "ace/lib/dom",
      "ace/ext/menu_tools/get_editor_keyboard_shortcuts",
      "ace/autocomplete",
      "ace/autocomplete/popup",
      "ace/autocomplete/popup",
      "ace/undomanager",
      "ace/tokenizer",
      "ace/ext/menu_tools/overlay_page",
      "ace/ext/modelist",
    ],
    function (e, t, n) {
      "use strict";
      function d(e, t, n, r) {
        function b() {
          var e;
          m && m.getCursorPosition().row > 0 ? (e = x()) : (e = o.getValue());
          var t = m ? m.getData(m.getRow()) : e;
          t &&
            !t.error &&
            (E(), n.onAccept && n.onAccept({ value: e, item: t }, o));
        }
        function E() {
          v.close(), r && r(), (p = null);
        }
        function S() {
          if (n.getCompletions) {
            var e;
            n.getPrefix && (e = n.getPrefix(o));
            var t = n.getCompletions(o);
            m.setData(t, e), m.resize(!0);
          }
        }
        function x() {
          var e = m.getData(m.getRow());
          if (e && !e.error) return e.value || e.caption || e;
        }
        if (typeof t == "object") return d(e, "", t, n);
        if (p) {
          var s = p;
          (e = s.editor), s.close();
          if (s.name && s.name == n.name) return;
        }
        if (n.$type) return d[n.$type](e, r);
        var o = a();
        o.session.setUndoManager(new f());
        var h = i.buildDom([
            "div",
            {
              class:
                "ace_prompt_container" +
                (n.hasDescription ? " input-box-with-description" : ""),
            },
          ]),
          v = c(e, h, E);
        h.appendChild(o.container),
          e &&
            ((e.cmdLine = o), o.setOption("fontSize", e.getOption("fontSize"))),
          t && o.setValue(t, 1),
          n.selection &&
            o.selection.setRange({
              start: o.session.doc.indexToPosition(n.selection[0]),
              end: o.session.doc.indexToPosition(n.selection[1]),
            });
        if (n.getCompletions) {
          var m = new u();
          m.renderer.setStyle("ace_autocomplete_inline"),
            (m.container.style.display = "block"),
            (m.container.style.maxWidth = "600px"),
            (m.container.style.width = "100%"),
            (m.container.style.marginTop = "3px"),
            m.renderer.setScrollMargin(2, 2, 0, 0),
            (m.autoSelect = !1),
            (m.renderer.$maxLines = 15),
            m.setRow(-1),
            m.on("click", function (e) {
              var t = m.getData(m.getRow());
              t.error || (o.setValue(t.value || t.name || t), b(), e.stop());
            }),
            h.appendChild(m.container),
            S();
        }
        if (n.$rules) {
          var g = new l(n.$rules);
          o.session.bgTokenizer.setTokenizer(g);
        }
        n.placeholder && o.setOption("placeholder", n.placeholder);
        if (n.hasDescription) {
          var y = i.buildDom(["div", { class: "ace_prompt_text_container" }]);
          i.buildDom(
            n.prompt || "Press 'Enter' to confirm or 'Escape' to cancel",
            y
          ),
            h.appendChild(y);
        }
        v.setIgnoreFocusOut(n.ignoreFocusOut);
        var w = {
          Enter: b,
          "Esc|Shift-Esc": function () {
            n.onCancel && n.onCancel(o.getValue(), o), E();
          },
        };
        m &&
          Object.assign(w, {
            Up: function (e) {
              m.goTo("up"), x();
            },
            Down: function (e) {
              m.goTo("down"), x();
            },
            "Ctrl-Up|Ctrl-Home": function (e) {
              m.goTo("start"), x();
            },
            "Ctrl-Down|Ctrl-End": function (e) {
              m.goTo("end"), x();
            },
            Tab: function (e) {
              m.goTo("down"), x();
            },
            PageUp: function (e) {
              m.gotoPageUp(), x();
            },
            PageDown: function (e) {
              m.gotoPageDown(), x();
            },
          }),
          o.commands.bindKeys(w),
          o.on("input", function () {
            n.onInput && n.onInput(), S();
          }),
          o.resize(!0),
          m && m.resize(!0),
          o.focus(),
          (p = { close: E, name: n.name, editor: e });
      }
      var r = e("../range").Range,
        i = e("../lib/dom"),
        s = e("../ext/menu_tools/get_editor_keyboard_shortcuts"),
        o = e("../autocomplete").FilteredList,
        u = e("../autocomplete/popup").AcePopup,
        a = e("../autocomplete/popup").$singleLineEditor,
        f = e("../undomanager").UndoManager,
        l = e("../tokenizer").Tokenizer,
        c = e("./menu_tools/overlay_page").overlayPage,
        h = e("./modelist"),
        p;
      (d.gotoLine = function (e, t) {
        function n(e) {
          return (
            Array.isArray(e) || (e = [e]),
            e
              .map(function (e) {
                var t = e.isBackwards ? e.start : e.end,
                  n = e.isBackwards ? e.end : e.start,
                  r = n.row,
                  i = r + 1 + ":" + n.column;
                return (
                  n.row == t.row
                    ? n.column != t.column && (i += ">:" + t.column)
                    : (i += ">" + (t.row + 1) + ":" + t.column),
                  i
                );
              })
              .reverse()
              .join(", ")
          );
        }
        d(e, ":" + n(e.selection.toJSON()), {
          name: "gotoLine",
          selection: [1, Number.MAX_VALUE],
          onAccept: function (t) {
            var n = t.value,
              i = d.gotoLine._history;
            i || (d.gotoLine._history = i = []),
              i.indexOf(n) != -1 && i.splice(i.indexOf(n), 1),
              i.unshift(n),
              i.length > 20 && (i.length = 20);
            var s = e.getCursorPosition(),
              o = [];
            n
              .replace(/^:/, "")
              .split(/,/)
              .map(function (t) {
                function u() {
                  var t = n[i++];
                  if (!t) return;
                  if (t[0] == "c") {
                    var r = parseInt(t.slice(1)) || 0;
                    return e.session.doc.indexToPosition(r);
                  }
                  var o = s.row,
                    u = 0;
                  return (
                    /\d/.test(t) && ((o = parseInt(t) - 1), (t = n[i++])),
                    t == ":" &&
                      ((t = n[i++]), /\d/.test(t) && (u = parseInt(t) || 0)),
                    { row: o, column: u }
                  );
                }
                var n = t.split(/([<>:+-]|c?\d+)|[^c\d<>:+-]+/).filter(Boolean),
                  i = 0;
                s = u();
                var a = r.fromPoints(s, s);
                n[i] == ">"
                  ? (i++, (a.end = u()))
                  : n[i] == "<" && (i++, (a.start = u())),
                  o.unshift(a);
              }),
              e.selection.fromJSON(o);
            var u = e.renderer.scrollTop;
            e.renderer.scrollSelectionIntoView(
              e.selection.anchor,
              e.selection.cursor,
              0.5
            ),
              e.renderer.animateScrolling(u);
          },
          history: function () {
            var t = e.session.getUndoManager();
            return d.gotoLine._history ? d.gotoLine._history : [];
          },
          getCompletions: function (t) {
            var n = t.getValue(),
              r = n.replace(/^:/, "").split(":"),
              i = Math.min(parseInt(r[0]) || 1, e.session.getLength()) - 1,
              s = e.session.getLine(i),
              o = n + "  " + s;
            return [o].concat(this.history());
          },
          $rules: {
            start: [
              { regex: /\d+/, token: "string" },
              { regex: /[:,><+\-c]/, token: "keyword" },
            ],
          },
        });
      }),
        (d.commands = function (e, t) {
          function n(e) {
            return (e || "")
              .replace(/^./, function (e) {
                return e.toUpperCase(e);
              })
              .replace(/[a-z][A-Z]/g, function (e) {
                return e[0] + " " + e[1].toLowerCase(e);
              });
          }
          function r(t) {
            var r = [],
              i = {};
            return (
              e.keyBinding.$handlers.forEach(function (e) {
                var s = e.platform,
                  o = e.byName;
                for (var u in o) {
                  var a = o[u].bindKey;
                  typeof a != "string" && (a = (a && a[s]) || "");
                  var f = o[u],
                    l = f.description || n(f.name);
                  Array.isArray(f) || (f = [f]),
                    f.forEach(function (e) {
                      typeof e != "string" && (e = e.name);
                      var n = t.find(function (t) {
                        return t === e;
                      });
                      n ||
                        (i[e]
                          ? (i[e].key += "|" + a)
                          : ((i[e] = { key: a, command: e, description: l }),
                            r.push(i[e])));
                    });
                }
              }),
              r
            );
          }
          var i = ["insertstring", "inserttext", "setIndentation", "paste"],
            s = r(i);
          (s = s.map(function (e) {
            return { value: e.description, meta: e.key, command: e.command };
          })),
            d(e, "", {
              name: "commands",
              selection: [0, Number.MAX_VALUE],
              maxHistoryCount: 5,
              onAccept: function (t) {
                if (t.item) {
                  var n = t.item.command;
                  this.addToHistory(t.item), e.execCommand(n);
                }
              },
              addToHistory: function (e) {
                var t = this.history();
                t.unshift(e), delete e.message;
                for (var n = 1; n < t.length; n++)
                  if (t[n]["command"] == e.command) {
                    t.splice(n, 1);
                    break;
                  }
                this.maxHistoryCount > 0 &&
                  t.length > this.maxHistoryCount &&
                  t.splice(t.length - 1, 1),
                  (d.commands.history = t);
              },
              history: function () {
                return d.commands.history || [];
              },
              getPrefix: function (e) {
                var t = e.getCursorPosition(),
                  n = e.getValue();
                return n.substring(0, t.column);
              },
              getCompletions: function (e) {
                function t(e, t) {
                  var n = JSON.parse(JSON.stringify(e)),
                    r = new o(n);
                  return r.filterCompletions(n, t);
                }
                function n(e, t) {
                  if (!t || !t.length) return e;
                  var n = [];
                  t.forEach(function (e) {
                    n.push(e.command);
                  });
                  var r = [];
                  return (
                    e.forEach(function (e) {
                      n.indexOf(e.command) === -1 && r.push(e);
                    }),
                    r
                  );
                }
                var r = this.getPrefix(e),
                  i = t(this.history(), r),
                  u = n(s, i);
                (u = t(u, r)),
                  i.length &&
                    u.length &&
                    ((i[0].message = " Recently used"),
                    (u[0].message = " Other commands"));
                var a = i.concat(u);
                return a.length > 0
                  ? a
                  : [{ value: "No matching commands", error: 1 }];
              },
            });
        }),
        (d.modes = function (e, t) {
          var n = h.modes;
          (n = n.map(function (e) {
            return { value: e.caption, mode: e.name };
          })),
            d(e, "", {
              name: "modes",
              selection: [0, Number.MAX_VALUE],
              onAccept: function (t) {
                if (t.item) {
                  var n = "ace/mode/" + t.item.mode;
                  e.session.setMode(n);
                }
              },
              getPrefix: function (e) {
                var t = e.getCursorPosition(),
                  n = e.getValue();
                return n.substring(0, t.column);
              },
              getCompletions: function (e) {
                function t(e, t) {
                  var n = JSON.parse(JSON.stringify(e)),
                    r = new o(n);
                  return r.filterCompletions(n, t);
                }
                var r = this.getPrefix(e),
                  i = t(n, r);
                return i.length > 0
                  ? i
                  : [
                      {
                        caption: "No mode matching",
                        value: "No mode matching",
                        error: 1,
                      },
                    ];
              },
            });
        }),
        i.importCssString(
          ".ace_prompt_container {\n    max-width: 600px;\n    width: 100%;\n    margin: 20px auto;\n    padding: 3px;\n    background: white;\n    border-radius: 2px;\n    box-shadow: 0px 2px 3px 0px #555;\n}",
          "promtp.css",
          !1
        ),
        (t.prompt = d);
    }
  );
(function () {
  window.require(["ace/ext/prompt"], function (m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
