define(
  "ace/mode/xml_highlight_rules",
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
      s = function (e) {
        var t = "[_:a-zA-Z\u00c0-\uffff][-_:.a-zA-Z0-9\u00c0-\uffff]*";
        (this.$rules = {
          start: [
            {
              token: "string.cdata.xml",
              regex: "<\\!\\[CDATA\\[",
              next: "cdata",
            },
            {
              token: ["punctuation.instruction.xml", "keyword.instruction.xml"],
              regex: "(<\\?)(" + t + ")",
              next: "processing_instruction",
            },
            { token: "comment.start.xml", regex: "<\\!--", next: "comment" },
            {
              token: ["xml-pe.doctype.xml", "xml-pe.doctype.xml"],
              regex: "(<\\!)(DOCTYPE)(?=[\\s])",
              next: "doctype",
              caseInsensitive: !0,
            },
            { include: "tag" },
            { token: "text.end-tag-open.xml", regex: "</" },
            { token: "text.tag-open.xml", regex: "<" },
            { include: "reference" },
            { defaultToken: "text.xml" },
          ],
          processing_instruction: [
            {
              token: "entity.other.attribute-name.decl-attribute-name.xml",
              regex: t,
            },
            { token: "keyword.operator.decl-attribute-equals.xml", regex: "=" },
            { include: "whitespace" },
            { include: "string" },
            { token: "punctuation.xml-decl.xml", regex: "\\?>", next: "start" },
          ],
          doctype: [
            { include: "whitespace" },
            { include: "string" },
            { token: "xml-pe.doctype.xml", regex: ">", next: "start" },
            { token: "xml-pe.xml", regex: "[-_a-zA-Z0-9:]+" },
            {
              token: "punctuation.int-subset",
              regex: "\\[",
              push: "int_subset",
            },
          ],
          int_subset: [
            { token: "text.xml", regex: "\\s+" },
            { token: "punctuation.int-subset.xml", regex: "]", next: "pop" },
            {
              token: ["punctuation.markup-decl.xml", "keyword.markup-decl.xml"],
              regex: "(<\\!)(" + t + ")",
              push: [
                { token: "text", regex: "\\s+" },
                {
                  token: "punctuation.markup-decl.xml",
                  regex: ">",
                  next: "pop",
                },
                { include: "string" },
              ],
            },
          ],
          cdata: [
            { token: "string.cdata.xml", regex: "\\]\\]>", next: "start" },
            { token: "text.xml", regex: "\\s+" },
            { token: "text.xml", regex: "(?:[^\\]]|\\](?!\\]>))+" },
          ],
          comment: [
            { token: "comment.end.xml", regex: "-->", next: "start" },
            { defaultToken: "comment.xml" },
          ],
          reference: [
            {
              token: "constant.language.escape.reference.xml",
              regex:
                "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)",
            },
          ],
          attr_reference: [
            {
              token: "constant.language.escape.reference.attribute-value.xml",
              regex:
                "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)",
            },
          ],
          tag: [
            {
              token: [
                "meta.tag.punctuation.tag-open.xml",
                "meta.tag.punctuation.end-tag-open.xml",
                "meta.tag.tag-name.xml",
              ],
              regex: "(?:(<)|(</))((?:" + t + ":)?" + t + ")",
              next: [
                { include: "attributes" },
                {
                  token: "meta.tag.punctuation.tag-close.xml",
                  regex: "/?>",
                  next: "start",
                },
              ],
            },
          ],
          tag_whitespace: [{ token: "text.tag-whitespace.xml", regex: "\\s+" }],
          whitespace: [{ token: "text.whitespace.xml", regex: "\\s+" }],
          string: [
            {
              token: "string.xml",
              regex: "'",
              push: [
                { token: "string.xml", regex: "'", next: "pop" },
                { defaultToken: "string.xml" },
              ],
            },
            {
              token: "string.xml",
              regex: '"',
              push: [
                { token: "string.xml", regex: '"', next: "pop" },
                { defaultToken: "string.xml" },
              ],
            },
          ],
          attributes: [
            { token: "entity.other.attribute-name.xml", regex: t },
            { token: "keyword.operator.attribute-equals.xml", regex: "=" },
            { include: "tag_whitespace" },
            { include: "attribute_value" },
          ],
          attribute_value: [
            {
              token: "string.attribute-value.xml",
              regex: "'",
              push: [
                {
                  token: "string.attribute-value.xml",
                  regex: "'",
                  next: "pop",
                },
                { include: "attr_reference" },
                { defaultToken: "string.attribute-value.xml" },
              ],
            },
            {
              token: "string.attribute-value.xml",
              regex: '"',
              push: [
                {
                  token: "string.attribute-value.xml",
                  regex: '"',
                  next: "pop",
                },
                { include: "attr_reference" },
                { defaultToken: "string.attribute-value.xml" },
              ],
            },
          ],
        }),
          this.constructor === s && this.normalizeRules();
      };
    (function () {
      this.embedTagRules = function (e, t, n) {
        this.$rules.tag.unshift({
          token: [
            "meta.tag.punctuation.tag-open.xml",
            "meta.tag." + n + ".tag-name.xml",
          ],
          regex: "(<)(" + n + "(?=\\s|>|$))",
          next: [
            { include: "attributes" },
            {
              token: "meta.tag.punctuation.tag-close.xml",
              regex: "/?>",
              next: t + "start",
            },
          ],
        }),
          (this.$rules[n + "-end"] = [
            { include: "attributes" },
            {
              token: "meta.tag.punctuation.tag-close.xml",
              regex: "/?>",
              next: "start",
              onMatch: function (e, t, n) {
                return n.splice(0), this.token;
              },
            },
          ]),
          this.embedRules(e, t, [
            {
              token: [
                "meta.tag.punctuation.end-tag-open.xml",
                "meta.tag." + n + ".tag-name.xml",
              ],
              regex: "(</)(" + n + "(?=\\s|>|$))",
              next: n + "-end",
            },
            { token: "string.cdata.xml", regex: "<\\!\\[CDATA\\[" },
            { token: "string.cdata.xml", regex: "\\]\\]>" },
          ]);
      };
    }.call(i.prototype),
      r.inherits(s, i),
      (t.XmlHighlightRules = s));
  }
),
  define(
    "ace/mode/behaviour/xml",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/behaviour",
      "ace/token_iterator",
      "ace/lib/lang",
    ],
    function (e, t, n) {
      "use strict";
      function u(e, t) {
        return e && e.type.lastIndexOf(t + ".xml") > -1;
      }
      var r = e("../../lib/oop"),
        i = e("../behaviour").Behaviour,
        s = e("../../token_iterator").TokenIterator,
        o = e("../../lib/lang"),
        a = function () {
          this.add("string_dquotes", "insertion", function (e, t, n, r, i) {
            if (i == '"' || i == "'") {
              var o = i,
                a = r.doc.getTextRange(n.getSelectionRange());
              if (
                a !== "" &&
                a !== "'" &&
                a != '"' &&
                n.getWrapBehavioursEnabled()
              )
                return { text: o + a + o, selection: !1 };
              var f = n.getCursorPosition(),
                l = r.doc.getLine(f.row),
                c = l.substring(f.column, f.column + 1),
                h = new s(r, f.row, f.column),
                p = h.getCurrentToken();
              if (c == o && (u(p, "attribute-value") || u(p, "string")))
                return { text: "", selection: [1, 1] };
              p || (p = h.stepBackward());
              if (!p) return;
              while (u(p, "tag-whitespace") || u(p, "whitespace"))
                p = h.stepBackward();
              var d = !c || c.match(/\s/);
              if (
                (u(p, "attribute-equals") && (d || c == ">")) ||
                (u(p, "decl-attribute-equals") && (d || c == "?"))
              )
                return { text: o + o, selection: [1, 1] };
            }
          }),
            this.add("string_dquotes", "deletion", function (e, t, n, r, i) {
              var s = r.doc.getTextRange(i);
              if (!i.isMultiLine() && (s == '"' || s == "'")) {
                var o = r.doc.getLine(i.start.row),
                  u = o.substring(i.start.column + 1, i.start.column + 2);
                if (u == s) return i.end.column++, i;
              }
            }),
            this.add("autoclosing", "insertion", function (e, t, n, r, i) {
              if (i == ">") {
                var o = n.getSelectionRange().start,
                  a = new s(r, o.row, o.column),
                  f = a.getCurrentToken() || a.stepBackward();
                if (
                  !f ||
                  !(
                    u(f, "tag-name") ||
                    u(f, "tag-whitespace") ||
                    u(f, "attribute-name") ||
                    u(f, "attribute-equals") ||
                    u(f, "attribute-value")
                  )
                )
                  return;
                if (u(f, "reference.attribute-value")) return;
                if (u(f, "attribute-value")) {
                  var l = a.getCurrentTokenColumn() + f.value.length;
                  if (o.column < l) return;
                  if (o.column == l) {
                    var c = a.stepForward();
                    if (c && u(c, "attribute-value")) return;
                    a.stepBackward();
                  }
                }
                if (/^\s*>/.test(r.getLine(o.row).slice(o.column))) return;
                while (!u(f, "tag-name")) {
                  f = a.stepBackward();
                  if (f.value == "<") {
                    f = a.stepForward();
                    break;
                  }
                }
                var h = a.getCurrentTokenRow(),
                  p = a.getCurrentTokenColumn();
                if (u(a.stepBackward(), "end-tag-open")) return;
                var d = f.value;
                h == o.row && (d = d.substring(0, o.column - p));
                if (this.voidElements.hasOwnProperty(d.toLowerCase())) return;
                return { text: "></" + d + ">", selection: [1, 1] };
              }
            }),
            this.add("autoindent", "insertion", function (e, t, n, r, i) {
              if (i == "\n") {
                var o = n.getCursorPosition(),
                  u = r.getLine(o.row),
                  a = new s(r, o.row, o.column),
                  f = a.getCurrentToken();
                if (f && f.type.indexOf("tag-close") !== -1) {
                  if (f.value == "/>") return;
                  while (f && f.type.indexOf("tag-name") === -1)
                    f = a.stepBackward();
                  if (!f) return;
                  var l = f.value,
                    c = a.getCurrentTokenRow();
                  f = a.stepBackward();
                  if (!f || f.type.indexOf("end-tag") !== -1) return;
                  if (this.voidElements && !this.voidElements[l]) {
                    var h = r.getTokenAt(o.row, o.column + 1),
                      u = r.getLine(c),
                      p = this.$getIndent(u),
                      d = p + r.getTabString();
                    return h && h.value === "</"
                      ? {
                          text: "\n" + d + "\n" + p,
                          selection: [1, d.length, 1, d.length],
                        }
                      : { text: "\n" + d };
                  }
                }
              }
            });
        };
      r.inherits(a, i), (t.XmlBehaviour = a);
    }
  ),
  define(
    "ace/mode/folding/xml",
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
      function a(e, t) {
        return e.type.lastIndexOf(t + ".xml") > -1;
      }
      var r = e("../../lib/oop"),
        i = e("../../range").Range,
        s = e("./fold_mode").FoldMode,
        o = (t.FoldMode = function (e, t) {
          s.call(this),
            (this.voidElements = e || {}),
            (this.optionalEndTags = r.mixin({}, this.voidElements)),
            t && r.mixin(this.optionalEndTags, t);
        });
      r.inherits(o, s);
      var u = function () {
        (this.tagName = ""),
          (this.closing = !1),
          (this.selfClosing = !1),
          (this.start = { row: 0, column: 0 }),
          (this.end = { row: 0, column: 0 });
      };
      (function () {
        (this.getFoldWidget = function (e, t, n) {
          var r = this._getFirstTagInLine(e, n);
          return r
            ? r.closing || (!r.tagName && r.selfClosing)
              ? t === "markbeginend"
                ? "end"
                : ""
              : !r.tagName ||
                r.selfClosing ||
                this.voidElements.hasOwnProperty(r.tagName.toLowerCase())
              ? ""
              : this._findEndTagInLine(e, n, r.tagName, r.end.column)
              ? ""
              : "start"
            : this.getCommentFoldWidget(e, n);
        }),
          (this.getCommentFoldWidget = function (e, t) {
            return /comment/.test(e.getState(t)) && /<!-/.test(e.getLine(t))
              ? "start"
              : "";
          }),
          (this._getFirstTagInLine = function (e, t) {
            var n = e.getTokens(t),
              r = new u();
            for (var i = 0; i < n.length; i++) {
              var s = n[i];
              if (a(s, "tag-open")) {
                (r.end.column = r.start.column + s.value.length),
                  (r.closing = a(s, "end-tag-open")),
                  (s = n[++i]);
                if (!s) return null;
                (r.tagName = s.value), (r.end.column += s.value.length);
                for (i++; i < n.length; i++) {
                  (s = n[i]), (r.end.column += s.value.length);
                  if (a(s, "tag-close")) {
                    r.selfClosing = s.value == "/>";
                    break;
                  }
                }
                return r;
              }
              if (a(s, "tag-close"))
                return (r.selfClosing = s.value == "/>"), r;
              r.start.column += s.value.length;
            }
            return null;
          }),
          (this._findEndTagInLine = function (e, t, n, r) {
            var i = e.getTokens(t),
              s = 0;
            for (var o = 0; o < i.length; o++) {
              var u = i[o];
              s += u.value.length;
              if (s < r) continue;
              if (a(u, "end-tag-open")) {
                u = i[o + 1];
                if (u && u.value == n) return !0;
              }
            }
            return !1;
          }),
          (this.getFoldWidgetRange = function (e, t, n) {
            var r = e.getMatchingTags({ row: n, column: 0 });
            return r
              ? new i(
                  r.openTag.end.row,
                  r.openTag.end.column,
                  r.closeTag.start.row,
                  r.closeTag.start.column
                )
              : this.getCommentFoldWidget(e, n) &&
                  e.getCommentFoldRange(n, e.getLine(n).length);
          });
      }.call(o.prototype));
    }
  ),
  define(
    "ace/mode/xml",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/lib/lang",
      "ace/mode/text",
      "ace/mode/xml_highlight_rules",
      "ace/mode/behaviour/xml",
      "ace/mode/folding/xml",
      "ace/worker/worker_client",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../lib/oop"),
        i = e("../lib/lang"),
        s = e("./text").Mode,
        o = e("./xml_highlight_rules").XmlHighlightRules,
        u = e("./behaviour/xml").XmlBehaviour,
        a = e("./folding/xml").FoldMode,
        f = e("../worker/worker_client").WorkerClient,
        l = function () {
          (this.HighlightRules = o),
            (this.$behaviour = new u()),
            (this.foldingRules = new a());
        };
      r.inherits(l, s),
        function () {
          (this.voidElements = i.arrayToMap([])),
            (this.blockComment = { start: "<!--", end: "-->" }),
            (this.createWorker = function (e) {
              var t = new f(["ace"], "ace/mode/xml_worker", "Worker");
              return (
                t.attachToDocument(e.getDocument()),
                t.on("error", function (t) {
                  e.setAnnotations(t.data);
                }),
                t.on("terminate", function () {
                  e.clearAnnotations();
                }),
                t
              );
            }),
            (this.$id = "ace/mode/xml");
        }.call(l.prototype),
        (t.Mode = l);
    }
  );
(function () {
  window.require(["ace/mode/xml"], function (m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
