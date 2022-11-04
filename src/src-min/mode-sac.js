define(
  "ace/mode/doc_comment_highlight_rules",
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
        this.$rules = {
          start: [
            { token: "comment.doc.tag", regex: "@[\\w\\d_]+" },
            s.getTagRule(),
            { defaultToken: "comment.doc", caseInsensitive: !0 },
          ],
        };
      };
    r.inherits(s, i),
      (s.getTagRule = function (e) {
        return {
          token: "comment.doc.tag.storage.type",
          regex: "\\b(?:TODO|FIXME|XXX|HACK)\\b",
        };
      }),
      (s.getStartRule = function (e) {
        return { token: "comment.doc", regex: "\\/\\*(?=\\*)", next: e };
      }),
      (s.getEndRule = function (e) {
        return { token: "comment.doc", regex: "\\*\\/", next: e };
      }),
      (t.DocCommentHighlightRules = s);
  }
),
  define(
    "ace/mode/sac_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/doc_comment_highlight_rules",
      "ace/mode/text_highlight_rules",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../lib/oop"),
        i = e("./doc_comment_highlight_rules").DocCommentHighlightRules,
        s = e("./text_highlight_rules").TextHighlightRules,
        o = function () {
          var e =
              "break|continue|do|else|for|if|return|with|while|use|class|all|void",
            t =
              "bool|char|complex|double|float|byte|int|short|long|longlong|ubyte|uint|ushort|ulong|ulonglong|struct|typedef",
            n = "inline|external|specialize",
            r = "step|width",
            s = "true|false",
            o = (this.$keywords = this.createKeywordMapper(
              {
                "keyword.control": e,
                "storage.type": t,
                "storage.modifier": n,
                "keyword.operator": r,
                "constant.language": s,
              },
              "identifier"
            )),
            u = "[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*\\b",
            a =
              /\\(?:['"?\\abfnrtv]|[0-7]{1,3}|x[a-fA-F\d]{2}|u[a-fA-F\d]{4}U[a-fA-F\d]{8}|.)/
                .source,
            f =
              "%" +
              /(\d+\$)?/.source +
              /[#0\- +']*/.source +
              /[,;:_]?/.source +
              /((-?\d+)|\*(-?\d+\$)?)?/.source +
              /(\.((-?\d+)|\*(-?\d+\$)?)?)?/.source +
              /(hh|h|ll|l|j|t|z|q|L|vh|vl|v|hv|hl)?/.source +
              /(\[[^"\]]+\]|[diouxXDOUeEfFgGaACcSspn%])/.source;
          (this.$rules = {
            start: [
              { token: "comment", regex: "//$", next: "start" },
              { token: "comment", regex: "//", next: "singleLineComment" },
              i.getStartRule("doc-start"),
              { token: "comment", regex: "\\/\\*", next: "comment" },
              { token: "string", regex: "'(?:" + a + "|.)?'" },
              {
                token: "string.start",
                regex: '"',
                stateName: "qqstring",
                next: [
                  { token: "string", regex: /\\\s*$/, next: "qqstring" },
                  { token: "constant.language.escape", regex: a },
                  { token: "constant.language.escape", regex: f },
                  { token: "string.end", regex: '"|$', next: "start" },
                  { defaultToken: "string" },
                ],
              },
              {
                token: "string.start",
                regex: 'R"\\(',
                stateName: "rawString",
                next: [
                  { token: "string.end", regex: '\\)"', next: "start" },
                  { defaultToken: "string" },
                ],
              },
              {
                token: "constant.numeric",
                regex: "0[xX][0-9a-fA-F]+(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b",
              },
              {
                token: "constant.numeric",
                regex:
                  "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b",
              },
              {
                token: "keyword",
                regex: "#\\s*(?:include|import|pragma|line|define|undef)\\b",
                next: "directive",
              },
              {
                token: "keyword",
                regex: "#\\s*(?:endif|if|ifdef|else|elif|ifndef)\\b",
              },
              {
                token: "support.function",
                regex: "fold|foldfix|genarray|modarray|propagate",
              },
              { token: o, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*" },
              {
                token: "keyword.operator",
                regex:
                  /--|\+\+|<<=|>>=|>>>=|<>|&&|\|\||\?:|[*%\/+\-&\^|~!<>=]=?/,
              },
              { token: "punctuation.operator", regex: "\\?|\\:|\\,|\\;|\\." },
              { token: "paren.lparen", regex: "[[({]" },
              { token: "paren.rparen", regex: "[\\])}]" },
              { token: "text", regex: "\\s+" },
            ],
            comment: [
              { token: "comment", regex: "\\*\\/", next: "start" },
              { defaultToken: "comment" },
            ],
            singleLineComment: [
              { token: "comment", regex: /\\$/, next: "singleLineComment" },
              { token: "comment", regex: /$/, next: "start" },
              { defaultToken: "comment" },
            ],
            directive: [
              { token: "constant.other.multiline", regex: /\\/ },
              { token: "constant.other.multiline", regex: /.*\\/ },
              { token: "constant.other", regex: "\\s*<.+?>", next: "start" },
              {
                token: "constant.other",
                regex: '\\s*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]',
                next: "start",
              },
              {
                token: "constant.other",
                regex: "\\s*['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']",
                next: "start",
              },
              { token: "constant.other", regex: /[^\\\/]+/, next: "start" },
            ],
          }),
            this.embedRules(i, "doc-", [i.getEndRule("start")]),
            this.normalizeRules();
        };
      r.inherits(o, s), (t.sacHighlightRules = o);
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
    "ace/mode/sac",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/sac_highlight_rules",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../lib/oop"),
        i = e("./text").Mode,
        s = e("./sac_highlight_rules").sacHighlightRules,
        o = e("./folding/cstyle").FoldMode,
        u = function () {
          (this.HighlightRules = s),
            (this.foldingRules = new o()),
            (this.$behaviour = this.$defaultBehaviour);
        };
      r.inherits(u, i),
        function () {
          (this.lineCommentStart = "//"),
            (this.blockComment = { start: "/*", end: "*/" }),
            (this.$id = "ace/mode/sac");
        }.call(u.prototype),
        (t.Mode = u);
    }
  );
(function () {
  window.require(["ace/mode/sac"], function (m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
