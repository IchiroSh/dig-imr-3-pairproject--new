define(
  "ace/mode/bibtex_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, n) {
    "use strict";
    var r = e("../lib/oop"),
      i = e("./text_highlight_rules").TextHighlightRules,
      s = function () {
        (this.$rules = {
          start: [
            {
              token: "comment",
              regex: /@Comment\{/,
              stateName: "bibtexComment",
              push: [
                { token: "comment", regex: /}/, next: "pop" },
                { token: "comment", regex: /\{/, push: "bibtexComment" },
                { defaultToken: "comment" },
              ],
            },
            {
              token: [
                "keyword",
                "text",
                "paren.lparen",
                "text",
                "variable",
                "text",
                "keyword.operator",
              ],
              regex: /(@String)(\s*)(\{)(\s*)([a-zA-Z]*)(\s*)(=)/,
              push: [
                { token: "paren.rparen", regex: /\}/, next: "pop" },
                { include: "#misc" },
                { defaultToken: "text" },
              ],
            },
            {
              token: [
                "keyword",
                "text",
                "paren.lparen",
                "text",
                "variable",
                "text",
                "keyword.operator",
              ],
              regex: /(@String)(\s*)(\()(\s*)([a-zA-Z]*)(\s*)(=)/,
              push: [
                { token: "paren.rparen", regex: /\)/, next: "pop" },
                { include: "#misc" },
                { defaultToken: "text" },
              ],
            },
            {
              token: ["keyword", "text", "paren.lparen"],
              regex: /(@preamble)(\s*)(\()/,
              push: [
                { token: "paren.rparen", regex: /\)/, next: "pop" },
                { include: "#misc" },
                { defaultToken: "text" },
              ],
            },
            {
              token: ["keyword", "text", "paren.lparen"],
              regex: /(@preamble)(\s*)(\{)/,
              push: [
                { token: "paren.rparen", regex: /\}/, next: "pop" },
                { include: "#misc" },
                { defaultToken: "text" },
              ],
            },
            {
              token: [
                "keyword",
                "text",
                "paren.lparen",
                "text",
                "support.class",
              ],
              regex: /(@[a-zA-Z]+)(\s*)(\{)(\s*)([\w-]+)/,
              push: [
                { token: "paren.rparen", regex: /\}/, next: "pop" },
                {
                  token: ["variable", "text", "keyword.operator"],
                  regex:
                    /([a-zA-Z0-9\!\$\&\*\+\-\.\/\:\;\<\>\?\[\]\^\_\`\|]+)(\s*)(=)/,
                  push: [
                    { token: "text", regex: /(?=[,}])/, next: "pop" },
                    { include: "#misc" },
                    { include: "#integer" },
                    { defaultToken: "text" },
                  ],
                },
                { token: "punctuation", regex: /,/ },
                { defaultToken: "text" },
              ],
            },
            { defaultToken: "comment" },
          ],
          "#integer": [{ token: "constant.numeric.bibtex", regex: /\d+/ }],
          "#misc": [
            { token: "string", regex: /"/, push: "#string_quotes" },
            { token: "paren.lparen", regex: /\{/, push: "#string_braces" },
            { token: "keyword.operator", regex: /#/ },
          ],
          "#string_braces": [
            { token: "paren.rparen", regex: /\}/, next: "pop" },
            { token: "invalid.illegal", regex: /@/ },
            { include: "#misc" },
            { defaultToken: "string" },
          ],
          "#string_quotes": [
            { token: "string", regex: /"/, next: "pop" },
            { include: "#misc" },
            { defaultToken: "string" },
          ],
        }),
          this.normalizeRules();
      };
    r.inherits(s, i), (t.BibTeXHighlightRules = s);
  }
),
  define(
    "ace/mode/folding/cstyle",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/range",
      "ace/mode/folding/fold_mode",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../../lib/oop"),
        i = e("../../range").Range,
        s = e("./fold_mode").FoldMode,
        o = (t.FoldMode = function (e) {
          e &&
            ((this.foldingStartMarker = new RegExp(
              this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
            )),
            (this.foldingStopMarker = new RegExp(
              this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
            )));
        });
      r.inherits(o, s),
        function () {
          (this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
            (this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
            (this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
            (this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
            (this._getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, n) {
              var r = e.getLine(n);
              if (
                this.singleLineBlockCommentRe.test(r) &&
                !this.startRegionRe.test(r) &&
                !this.tripleStarBlockCommentRe.test(r)
              )
                return "";
              var i = this._getFoldWidgetBase(e, t, n);
              return !i && this.startRegionRe.test(r) ? "start" : i;
            }),
            (this.getFoldWidgetRange = function (e, t, n, r) {
              var i = e.getLine(n);
              if (this.startRegionRe.test(i))
                return this.getCommentRegionBlock(e, i, n);
              var s = i.match(this.foldingStartMarker);
              if (s) {
                var o = s.index;
                if (s[1]) return this.openingBracketBlock(e, s[1], n, o);
                var u = e.getCommentFoldRange(n, o + s[0].length, 1);
                return (
                  u &&
                    !u.isMultiLine() &&
                    (r
                      ? (u = this.getSectionRange(e, n))
                      : t != "all" && (u = null)),
                  u
                );
              }
              if (t === "markbegin") return;
              var s = i.match(this.foldingStopMarker);
              if (s) {
                var o = s.index + s[0].length;
                return s[1]
                  ? this.closingBracketBlock(e, s[1], n, o)
                  : e.getCommentFoldRange(n, o, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              var n = e.getLine(t),
                r = n.search(/\S/),
                s = t,
                o = n.length;
              t += 1;
              var u = t,
                a = e.getLength();
              while (++t < a) {
                n = e.getLine(t);
                var f = n.search(/\S/);
                if (f === -1) continue;
                if (r > f) break;
                var l = this.getFoldWidgetRange(e, "all", t);
                if (l) {
                  if (l.start.row <= s) break;
                  if (l.isMultiLine()) t = l.end.row;
                  else if (r == f) break;
                }
                u = t;
              }
              return new i(s, o, u, e.getLine(u).length);
            }),
            (this.getCommentRegionBlock = function (e, t, n) {
              var r = t.search(/\s*$/),
                s = e.getLength(),
                o = n,
                u = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                a = 1;
              while (++n < s) {
                t = e.getLine(n);
                var f = u.exec(t);
                if (!f) continue;
                f[1] ? a-- : a++;
                if (!a) break;
              }
              var l = n;
              if (l > o) return new i(o, r, l, t.length);
            });
        }.call(o.prototype);
    }
  ),
  define(
    "ace/mode/bibtex",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/bibtex_highlight_rules",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../lib/oop"),
        i = e("./text").Mode,
        s = e("./bibtex_highlight_rules").BibTeXHighlightRules,
        o = e("./folding/cstyle").FoldMode,
        u = function () {
          (this.HighlightRules = s), (this.foldingRules = new o());
        };
      r.inherits(u, i),
        function () {
          this.$id = "ace/mode/bibtex";
        }.call(u.prototype),
        (t.Mode = u);
    }
  );
(function () {
  window.require(["ace/mode/bibtex"], function (m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
