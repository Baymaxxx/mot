(function (p, f) {
  "object" === typeof exports ? f(exports) : "function" === typeof define && define.amd ? define(["exports"], f) : f(p)
})(this, function (p) {
  function f(a) {
    this._targetElement = a;
    this._options = {
      nextLabel: "Next &rarr;",
      prevLabel: "&larr; Back",
      skipLabel: "Skip",
      doneLabel: "Done",
      tooltipPosition: "bottom",
      tooltipClass: "",
      exitOnEsc: !0,
      exitOnOverlayClick: !0,
      showStepNumbers: !0,
      keyboardNavigation: !0,
      showButtons: !0,
      showBullets: !0,
      scrollToElement: !0,
      overlayOpacity: 0.8
    }
  }

  function r(a) {
    if (null == a || "object" != typeof a ||
      "undefined" != typeof a.nodeType)return a;
    var b = {}, c;
    for (c in a)b[c] = r(a[c]);
    return b
  }

  function s() {
    this._direction = "forward";
    "undefined" === typeof this._currentStep ? this._currentStep = 0 : ++this._currentStep;
    if (this._introItems.length <= this._currentStep) "function" === typeof this._introCompleteCallback && this._introCompleteCallback.call(this), t.call(this, this._targetElement); else {
      var a = this._introItems[this._currentStep];
      "undefined" !== typeof this._introBeforeChangeCallback && this._introBeforeChangeCallback.call(this,
        a.element);
      A.call(this, a)
    }
  }

  function x() {
    this._direction = "backward";
    if (0 === this._currentStep)return !1;
    var a = this._introItems[--this._currentStep];
    "undefined" !== typeof this._introBeforeChangeCallback && this._introBeforeChangeCallback.call(this, a.element);
    A.call(this, a)
  }

  function t(a) {
    var b = a.querySelector(".introjs-overlay");
    if (null != b) {
      b.style.opacity = 0;
      setTimeout(function () {
        b.parentNode && b.parentNode.removeChild(b)
      }, 500);
      (a = a.querySelector(".introjs-helperLayer")) && a.parentNode.removeChild(a);
      (a = document.querySelector(".introjsFloatingElement")) &&
      a.parentNode.removeChild(a);
      if (a = document.querySelector(".introjs-showElement")) a.className = a.className.replace(/introjs-[a-zA-Z]+/g, "").replace(/^\s+|\s+$/g, "");
      if ((a = document.querySelectorAll(".introjs-fixParent")) && 0 < a.length)for (var c = a.length - 1; 0 <= c; c--)a[c].className = a[c].className.replace(/introjs-fixParent/g, "").replace(/^\s+|\s+$/g, "");
//                window.removeEventListener ? window.removeEventListener("keydown", this._onKeyDown, !0) : document.detachEvent && document.detachEvent("onkeydown", this._onKeyDown);
      this._currentStep = void 0
    }
  }

  function B(a, b, c, d) {
    var e = "";
    b.style.top = null;
    b.style.right = null;
    b.style.bottom = null;
    b.style.left = null;
    b.style.marginLeft = null;
    b.style.marginTop = null;
    c.style.display = "inherit";
    "undefined" != typeof d && null != d && (d.style.top = null, d.style.left = null);
    if (this._introItems[this._currentStep])switch (e = this._introItems[this._currentStep], e = "string" === typeof e.tooltipClass ? e.tooltipClass : this._options.tooltipClass, b.className = ("introjs-tooltip " + e).replace(/^\s+|\s+$/g, ""), currentTooltipPosition =
      this._introItems[this._currentStep].position, currentTooltipPosition) {
      case "top":
        b.style.left = "15px";
        b.style.top = "-" + (h(b).height + 10) + "px";
        c.className = "introjs-arrow bottom";
        break;
      case "right":
        b.style.left = h(a).width + 20 + "px";
        c.className = "introjs-arrow left";
        break;
      case "left":
        !0 == this._options.showStepNumbers && (b.style.top = "15px");
        b.style.right = h(a).width + 20 + "px";
        c.className = "introjs-arrow right";
        break;
      case "floating":
        c.style.display = "none";
        a = h(b);
        b.style.left = "50%";
        b.style.top = "50%";
        b.style.marginLeft =
          "-" + a.width / 2 + "px";
        b.style.marginTop = "-" + a.height / 2 + "px";
        "undefined" != typeof d && null != d && (d.style.left = "-" + (a.width / 2 + 18) + "px", d.style.top = "-" + (a.height / 2 + 18) + "px");
        break;
      case "bottom-right-aligned":
        c.className = "introjs-arrow top-righ" +
          "t";
        b.style.right = "0px";
        b.style.bottom = "-" + (h(b).height + 10) + "px";
        break;
      case "bottom-middle-aligned":
        d = h(a);
        a = h(b);
        c.className = "introjs-arrow top-middle";
        b.style.left = d.width / 2 - a.width / 2 + "px";
        b.style.bottom = "-" + (a.height + 10) + "px";
        break;
      default:
        b.style.bottom = "-" + (h(b).height +
          10) + "px", c.className = "introjs-arrow top"
    }
  }

  function v(a) {
    if (a && this._introItems[this._currentStep]) {
      var b = this._introItems[this._currentStep], c = h(b.element), d = 10;
      "floating" == b.position && (d = 0);
      a.setAttribute("style", "width: " + (c.width + d) + "px; height:" + (c.height + d) + "px; top:" + (c.top - 5) + "px;left: " + (c.left - 5) + "px;")
    }
  }

  function A(a) {
    var b;
    "undefined" !== typeof this._introChangeCallback && this._introChangeCallback.call(this, a.element);
    var c = this, d = document.querySelector(".introjs-helperLayer");
    h(a.element);
    if (null != d) {
      var e = d.querySelector(".introjs-helperNumberLayer"), C = d.querySelector(".introjs-tooltiptext"), g = d.querySelector(".introjs-arrow"), y = d.querySelector(".introjs-tooltip"), k = d.querySelector(".introjs-skipbutton"), n = d.querySelector(".introjs-prevbutton"), l = d.querySelector(".introjs-nextbutton");
      y.style.opacity = 0;
      if (null != e && (b = this._introItems[0 <= a.step - 2 ? a.step - 2 : 0], null != b && "forward" == this._direction && "floating" == b.position || "backward" == this._direction && "floating" == a.position)) e.style.opacity =
        0;
      v.call(c, d);
      var m = document.querySelectorAll(".introjs-fixParent");
      if (m && 0 < m.length)for (b = m.length - 1; 0 <= b; b--)m[b].className = m[b].className.replace(/introjs-fixParent/g, "").replace(/^\s+|\s+$/g, "");
      b = document.querySelector(".introjs-showElement");
      b.className = b.className.replace(/introjs-[a-zA-Z]+/g, "").replace(/^\s+|\s+$/g, "");
//指导语文字框过渡,a.step:第几步  dst
      c._lastShowElementTimer && clearTimeout(c._lastShowElementTimer);
      c._lastShowElementTimer = (function () {
        null != e && (e.innerHTML = a.step);
        C.innerHTML = a.intro;
        B.call(c, a.element,
          y, g, e);
        d.querySelector(".introjs-bullets li > a.active").className = "";
        d.querySelector('.introjs-bullets li > a[data-stepnumber="' + a.step + '"]').className = "active";
        y.style.opacity = 1;
        e && (e.style.opacity = 1);
        switch (a.step) {
          case 2:
            console.log(1);
            break;
          case 3:
            break;
          case 5:
            $('.introjs-tooltip').css({
              // top: '-85px'
            });
            $('.introjs-arrow.right').css({
              // top: '88px'
            })
            break;
          case 6:
            $('.introjs-arrow.right').css({
              // top: '29px'
            })
            break;
          case 7:
            $('.introjs-tooltip').css({
              // top: '-60px'
            });
            $('.introjs-arrow.right').css({
              // top: '67px'
            });
          default :
            break;
        }
      }());
    } else {
      var k = document.createElement("div"), m = document.createElement("div"), j = document.createElement("div"), n = document.createElement("div"), l = document.createElement("div"), f = document.createElement("div");
      k.className = "introjs-helperLayer";
      v.call(c, k);
      this._targetElement.appendChild(k);
      m.className =
        "introjs-arrow";
      n.className = "introjs-tooltiptext";
      n.innerHTML = a.intro;
      l.className = "introjs-bullets";
      !1 === this._options.showBullets && (l.style.display = "none");
      var p = document.createElement("ul");
      b = 0;
      for (var u = this._introItems.length; b < u; b++) {
        var r = document.createElement("li"), q = document.createElement("a");
        q.onclick = function () {
          c.goToStep(this.getAttribute("data-stepnumber"))
        };
        0 === b && (q.className = "active");
        q.href = "javascript:void(0);";
        q.innerHTML = "&nbsp;";
        q.setAttribute("data-stepnumber", this._introItems[b].step);
        r.appendChild(q);
        p.appendChild(r)
      }
      l.appendChild(p);
      f.className = "introjs-tooltipbuttons";
      !1 === this._options.showButtons && (f.style.display = "none");
      j.className = "introjs-tooltip";
      j.appendChild(n);
      j.appendChild(l);
      if (!0 == this._options.showStepNumbers) {
        var w = document.createElement("span");
        w.className = "introjs-helperNumberLayer";
        w.innerHTML = a.step;
        k.appendChild(w)
      }
      j.appendChild(m);
      k.appendChild(j);
      l = document.createElement("a");
//下一步点击事件 dst
      l.onclick = function () {
        //当class含有introjs-disabled 无法点击
        var patt = new RegExp("introjs-disabled");
        if (patt.test(l.className)) {
          l.onclick = function () {
            if (patt.test(l.className)) {
              return;
            } else {
              c._introItems.length - 1 != c._currentStep && s.call(c)
            }
          }
        } else {
          c._introItems.length - 1 != c._currentStep && s.call(c)
        }
      };
      l.href =
        "javascript:void(0);";
      l.innerHTML = this._options.nextLabel;
      n = document.createElement("a");
      n.onclick = function () {
        0 != c._currentStep && x.call(c)
      };
      n.href = "javascript:void(0);";
      n.innerHTML = this._options.prevLabel;
      k = document.createElement("a");
      k.className = "introjs-button introjs-skipbutton";
      k.href = "javascript:void(0);";
      k.innerHTML = this._options.skipLabel;
      k.onclick = function () {
        c._introItems.length - 1 == c._currentStep && "function" === typeof c._introCompleteCallback && c._introCompleteCallback.call(c);
        c._introItems.length -
        1 != c._currentStep && "function" === typeof c._introExitCallback && c._introExitCallback.call(c);
        t.call(c, c._targetElement)
      };
      f.appendChild(k);
      1 < this._introItems.length && (f.appendChild(n), f.appendChild(l));
      j.appendChild(f);
      B.call(c, a.element, j, m, w)
    }
    0 == this._currentStep && 1 < this._introItems.length ? (n.className = "introjs-button introjs-prevbutton introjs-disabled", l.className = "introjs-button introjs-nextbutton", k.innerHTML = this._options.skipLabel) : this._introItems.length - 1 == this._currentStep || 1 == this._introItems.length ?
      (k.innerHTML = this._options.doneLabel, n.className = "introjs-button introjs-prevbutton", l.className = "introjs-button introjs-nextbutton introjs-disabled") : (n.className = "introjs-button introjs-prevbutton", l.className = "introjs-button introjs-nextbutton", k.innerHTML = this._options.skipLabel);
//this._currentStep 为step - 1  dst
    var curr = this._currentStep;
    if (curr === 2) {
      l.className = "introjs-button introjs-nextbutton";
    } else if (curr === 6 || curr === 3 || curr === 4 || curr === 5) {
      l.className = "introjs-button introjs-nextbutton introjs-disabled displayNone"
    }
    //l.focus();
    a.element.className += " introjs-showElement";
    b = z(a.element, "position");
    "absolute" !== b && "relative" !== b && (a.element.className += " introjs-relativePosition");
    for (b = a.element.parentNode; null != b && "body" !== b.tagName.toLowerCase();) {
      m =
        z(b, "z-index");
      j = parseFloat(z(b, "opacity"));
      if (/[0-9]+/.test(m) || 1 > j) b.className += " introjs-fixParent";
      b = b.parentNode
    }
    b = a.element.getBoundingClientRect();
    !(0 <= b.top && 0 <= b.left && b.bottom + 80 <= window.innerHeight && b.right <= window.innerWidth) && !0 === this._options.scrollToElement && (j = a.element.getBoundingClientRect(), b = void 0 != window.innerWidth ? window.innerHeight : document.documentElement.clientHeight, m = j.bottom - (j.bottom - j.top), j = j.bottom - b, 0 > m || a.element.clientHeight > b ? window.scrollBy(0, m - 30) : window.scrollBy(0,
      j + 100));
    "undefined" !== typeof this._introAfterChangeCallback && this._introAfterChangeCallback.call(this, a.element)
  }

  function z(a, b) {
    var c = "";
    a.currentStyle ? c = a.currentStyle[b] : document.defaultView && document.defaultView.getComputedStyle && (c = document.defaultView.getComputedStyle(a, null).getPropertyValue(b));
    return c && c.toLowerCase ? c.toLowerCase() : c
  }

  function D(a) {
    var b = document.createElement("div"), c = "", d = this;
    b.className = "introjs-overlay";
    if ("body" === a.tagName.toLowerCase()) c += "top: 0;bottom: 0; left: 0;right: 0;position: fixed;",
      b.setAttribute("style", c); else {
      var e = h(a);
      e && (c += "width: " + e.width + "px; height:" + e.height + "px; top:" + e.top + "px;left: " + e.left + "px;", b.setAttribute("style", c))
    }
    a.appendChild(b);
    //点击任意地方事件
    //b.onclick = function () {
    //    !0 == d._options.exitOnOverlayClick && (t.call(d, a), void 0 != d._introExitCallback && d._introExitCallback.call(d))
    //};
    setTimeout(function () {
      c += "opacity: 0.5;filter:alpha(opacity=50";
      b.setAttribute("style", c)
    }, 10);
    return !0
  }

  function h(a) {
    var b = {};
    b.width = a.offsetWidth;
    b.height = a.offsetHeight;
    for (var c =
      0, d = 0; a && !isNaN(a.offsetLeft) && !isNaN(a.offsetTop);)c += a.offsetLeft, d += a.offsetTop, a = a.offsetParent;
    b.top = d;
    b.left = c;
    return b
  }

  var u = function (a) {
    if ("object" === typeof a)return new f(a);
    if ("string" === typeof a) {
      if (a = document.querySelector(a))return new f(a);
      throw Error("There is no element with given selector.");
    }
    return new f(document.body)
  };
  u.version = "0.9.0";
  u.fn = f.prototype = {
    clone: function () {
      return new f(this)
    }, setOption: function (a, b) {
      this._options[a] = b;
      return this
    }, setOptions: function (a) {
      var b = this._options,
        c = {}, d;
      for (d in b)c[d] = b[d];
      for (d in a)c[d] = a[d];
      this._options = c;
      return this
    }, start: function () {
      a:{
        var a = this._targetElement, b = [], c = this;
        if (this._options.steps)for (var d = [], e = 0, d = this._options.steps.length; e < d; e++) {
          var f = r(this._options.steps[e]);
          f.step = b.length + 1;
          "string" === typeof f.element && (f.element = document.querySelector(f.element));
          if ("undefined" === typeof f.element || null == f.element) {
            var g = document.querySelector(".introjsFloatingElement");
            null == g && (g = document.createElement("div"), g.className =
              "introjsFloatingElement", document.body.appendChild(g));
            f.element = g;
            f.position = "floating"
          }
          null != f.element && b.push(f)
        } else {
          d = a.querySelectorAll("*[data-intro]");
          if (1 > d.length)break a;
          e = 0;
          for (f = d.length; e < f; e++) {
            var g = d[e], h = parseInt(g.getAttribute("data-step"), 10);
            0 < h && (b[h - 1] = {
              element: g,
              intro: g.getAttribute("data-intro"),
              step: parseInt(g.getAttribute("data-step"), 10),
              tooltipClass: g.getAttribute("data-tooltipClass"),
              position: g.getAttribute("data-position") || this._options.tooltipPosition
            })
          }
          e = h = 0;
          for (f =
                 d.length; e < f; e++)if (g = d[e], null == g.getAttribute("data-step")) {
            for (; "undefined" != typeof b[h];)h++;
            b[h] = {
              element: g,
              intro: g.getAttribute("data-intro"),
              step: h + 1,
              tooltipClass: g.getAttribute("data-tooltipClass"),
              position: g.getAttribute("data-position") || this._options.tooltipPosition
            }
          }
        }
        e = [];
        for (d = 0; d < b.length; d++)b[d] && e.push(b[d]);
        b = e;
        b.sort(function (a, b) {
          return a.step - b.step
        });
        c._introItems = b;
        D.call(c, a) && (s.call(c), a.querySelector(".introjs-skipbutton"), a.querySelector(".introjs-nextbutton"), c._onKeyDown =
          function (b) {
            //if ( !0 == c._options.exitOnEsc)t.call(c, a), void 0 != c._introExitCallback && c._introExitCallback.call(c); else if (37 === b.keyCode)x.call(c); else if (39 === b.keyCode || 13 === b.keyCode)s.call(c), b.preventDefault ? b.preventDefault() : b.returnValue = !1
          }, c._onResize = function () {
          v.call(c, document.querySelector(".introjs-helperLayer"))
        }, window.addEventListener ? (this._options.keyboardNavigation && window.addEventListener("keydown", c._onKeyDown, !0), window.addEventListener("resize", c._onResize, !0)) :
        document.attachEvent && (this._options.keyboardNavigation && document.attachEvent("onkeydown", c._onKeyDown), document.attachEvent("onresize", c._onResize)))
      }
      return this
    }, goToStep: function (a) {
      this._currentStep = a - 2;
      "undefined" !== typeof this._introItems && s.call(this);
      return this
    }, nextStep: function () {
      s.call(this);
      return this
    }, previousStep: function () {
      x.call(this);
      return this
    }, exit: function () {
      t.call(this, this._targetElement)
    }, refresh: function () {
      v.call(this, document.querySelector(".introjs-helperLayer"));
      return this
    },
    onbeforechange: function (a) {
      if ("function" === typeof a) this._introBeforeChangeCallback = a; else throw Error("Provided callback for onbeforechange was not a function");
      return this
    }, onchange: function (a) {
      if ("function" === typeof a) this._introChangeCallback = a; else throw Error("Provided callback for onchange was not a function.");
      return this
    }, onafterchange: function (a) {
      if ("function" === typeof a) this._introAfterChangeCallback = a; else throw Error("Provided callback for onafterchange was not a function");
      return this
    },
    oncomplete: function (a) {
      if ("function" === typeof a) this._introCompleteCallback = a; else throw Error("Provided callback for oncomplete was not a function.");
      return this
    }, onexit: function (a) {
      if ("function" === typeof a) this._introExitCallback = a; else throw Error("Provided callback for onexit was not a function.");
      return this
    }
  };
  return p.introJs = u
});
