define("xg/jx-business/1.0.0/p/commodity/myGoods-debug", ["xg/jx-business/1.0.0/c/js/base/zepto-debug", "xg/jx-business/1.0.0/c/js/base/zepto-debug.touch", "xg/jx-business/1.0.0/c/js/base/zepto-debug.deferred", "xg/jx-business/1.0.0/c/js/base/zepto-debug.callbacks", "xg/jx-business/1.0.0/c/js/base/sm-debug", "xg/jx-business/1.0.0/c/js/base/sm-extend-debug", "xg/jx-business/1.0.0/c/js/fastclick-debug", "xg/jx-business/1.0.0/c/js/base/zepto-debug.jx", "xg/jx-business/1.0.0/c/js/tools-debug", "xg/jx-business/1.0.0/c/js/iscroll-infinite-debug", "xg/jx-business/1.0.0/p/commodity/goodsMng-debug.handlebars"], function(require, exports, module) {
    var $ = require("xg/jx-business/1.0.0/c/js/base/zepto-debug");
    require("xg/jx-business/1.0.0/c/js/base/zepto-debug.touch");
    require("xg/jx-business/1.0.0/c/js/base/zepto-debug.deferred");
    require("xg/jx-business/1.0.0/c/js/base/zepto-debug.callbacks");
    require("xg/jx-business/1.0.0/c/js/base/sm-debug");
    require("xg/jx-business/1.0.0/c/js/base/sm-extend-debug");
    require("xg/jx-business/1.0.0/c/js/fastclick-debug");
    require("xg/jx-business/1.0.0/c/js/base/zepto-debug.jx");
    var tools = require("xg/jx-business/1.0.0/c/js/tools-debug");
    var IScroll = require("xg/jx-business/1.0.0/c/js/iscroll-infinite-debug");
    var goodstemp = require("xg/jx-business/1.0.0/p/commodity/goodsMng-debug.handlebars");
    var pageInfo = [{
        page: 1,
        size: 8,
        over: 0
    }, {
        page: 1,
        size: 8,
        over: 0
    }, {
        page: 1,
        size: 8,
        over: 0
    }];
    var looping = false;
    module.exports = {
        init: function() {
            var self = this;
            $.showIndicator();
            self.ajaxforlist(1).then(self.ajaxforlist(2)).then(self.ajaxforlist(3));
            self.loado();
            self.scollandup()
        },
        ajaxforlist: function(tabNumber) {
            var self = this;
            var defer = $.Deferred();
            var section, plad = {};
            if (tabNumber === 1) {
                section = "#listview1"
            } else if (tabNumber === 2) {
                section = "#listview2";
                plad.status = 1
            } else if (tabNumber === 3) {
                section = "#listview3";
                plad.status = 0
            }
            plad.pageIndex = pageInfo[tabNumber - 1].page;
            plad.pageSize = pageInfo[tabNumber - 1].size;
            plad.type = 1;
            $.ajax({
                type: "post",
                cache: false,
                url: "/product/queryProductList",
                data: plad,
                success: function(data) {
                    if (data.result == "ok") {
                        if (data.data.length > 0) {
                            $("#tab" + tabNumber + " .infinite-scroll-preloader").hide();
                            for (var i = 0; i < data.data.length; i++) {
                                if (data.data[i].status == "1") {
                                    data.data[i].status = 1
                                } else {
                                    data.data[i].status = 0
                                }
                            }
                            self.intohtml(section, data.data);
                            looping = false;
                            pageInfo[tabNumber - 1].page = pageInfo[tabNumber - 1].page + 1
                        } else {
                            if (pageInfo[tabNumber - 1].page === 1) {
                                var ckmiss = "<div class='missing'><img src='http://static.hpbanking.com/xg/uploads/files/6c038b5768301c51fc839c06f93cc4e7-120-120.png'><div>暂无记录</div> </div>";
                                $(section).html(ckmiss)
                            } else {
                                $(section).append("<div class='search-no-data-2'>已经加载全部</div>");
                                $("#tab" + tabNumber + " .infinite-scroll-preloader").hide()
                            }
                            looping = false;
                            pageInfo[tabNumber - 1].over = 1
                        }
                        defer.resolve(true)
                    } else {
                        $.alert("<div class='error-tip'>" + "加载出错" + "</div>", "提示")
                    }
                }
            });
            return defer.promise()
        },
        intohtml: function(section, htmldata) {
            var self = this;
            var pasthtml = $(section).html();
            if (pasthtml == "") {
                $(section).html(goodstemp(htmldata))
            } else {
                $(section).append(goodstemp(htmldata))
            }
            $.hideIndicator();
            self.clickeve()
        },
        loado: function() {
            var self = this;
            $(".content").on("scroll", function() {
                var tabNumber;
                if ($(window).height() + $(".content").scrollTop() >= $(".content-block").height() - 200) {
                    if (looping == false) {
                        tabNumber = tabindex("tab");
                        if (!pageInfo[tabNumber - 1].over) {
                            $("#tab" + tabNumber + " .infinite-scroll-preloader").show();
                            looping = true;
                            self.ajaxforlist(tabNumber)
                        }
                    }
                }
            })
        },
        clickeve: function() {
            var self = this;
            $(document).unbind("click", ".upgoods").on("click", ".upgoods", function(e) {
                $.confirm("确认要上架这个宝贝吗?", function() {
                    self.changeUporNext($(e.target).data("goodid"), 1)
                }, function() {})
            }).unbind("click", ".editgoods").on("click", ".editgoods", function(e) {
                window.location.href = "/product/editGoods?goodid=" + $(e.target).data("goodid")
            }).unbind("click", ".deletegoods").on("click", ".deletegoods", function(e) {
                $.confirm("确认要删除这个宝贝吗?", function() {
                    self.deleteGoods($(e.target).data("goodid")).then(function(data) {
                        if (data) {
                            $(e.target).parent().parent().css({
                                opacity: 0
                            }).css({
                                width: 0,
                                height: 0
                            });
                            setTimeout(function() {
                                $(e.target).parent().parent().remove()
                            }, 100);
                            console.log($(e.target).parent().parent().parent().find(".goodsList").length);
                            if ($(e.target).parent().parent().parent().find(".goodsList").length == 1) {
                                var nowActive = tabindex("tab");
                                self.ajaxforlist(nowActive)
                            }
                        }
                    })
                }, function() {})
            }).unbind("click", ".downgoods").on("click", ".downgoods", function(e) {
                $.confirm("确认要下架这个宝贝吗?", function() {
                    self.changeUporNext($(e.target).data("goodid"), 0)
                }, function() {})
            }).unbind("click", ".addicon").on("click", ".addicon", function(e) {
                window.location.href = "/product/myUpload"
            })
        },
        deleteGoods: function(productId) {
            var defobj = $.Deferred();
            $.ajax({
                type: "post",
                cache: false,
                url: "/product/deleteProduct",
                data: {
                    productId: productId
                },
                success: function(data) {
                    if (data.result === "ok") {
                        defobj.resolve(true)
                    } else {
                        $.alert("<div class='error-tip'>" + data.error + "</div>", "提示");
                        defobj.reject()
                    }
                }
            });
            return defobj.promise()
        },
        changeUporNext: function(productId, UporDown) {
            $.ajax({
                type: "post",
                cache: false,
                url: "/product/changeStatus",
                data: {
                    productId: productId,
                    status: UporDown
                },
                success: function(data) {
                    if (data.result === "ok") {
                        window.location.reload()
                    } else {
                        $.alert("<div class='error-tip'>" + data.error + "</div>", "提示");
                        return false
                    }
                }
            })
        },
        scollandup: function() {
            $(window).on("swipeDown", function() {
                if ($(".content-block").height() > 1930) {
                    $(".returnTopm").css("display", "block")
                } else {
                    $(".returnTopm").css("display", "none")
                }
            });
            $(window).on("swipeUp", function() {
                $(".returnTopm").css("display", "none")
            })
        }
    };
    module.exports.init();

    function tabindex(section) {
        if ($("." + section + ".active").attr("id") === "tab1") {
            return 1
        } else if ($("." + section + ".active").attr("id") === "tab2") {
            return 2
        } else if ($("." + section + ".active").attr("id") === "tab3") {
            return 3
        }
    }
});
define("xg/jx-business/1.0.0/c/js/base/zepto-debug", [], function(require, exports, module) {
    var Zepto = function() {
        var undefined, key, $, classList, emptyArray = [],
            slice = emptyArray.slice,
            filter = emptyArray.filter,
            document = window.document,
            elementDisplay = {},
            classCache = {},
            cssNumber = {
                "column-count": 1,
                columns: 1,
                "font-weight": 1,
                "line-height": 1,
                opacity: 1,
                "z-index": 1,
                zoom: 1
            },
            fragmentRE = /^\s*<(\w+|!)[^>]*>/,
            singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
            tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
            rootNodeRE = /^(?:body|html)$/i,
            capitalRE = /([A-Z])/g,
            methodAttributes = ["val", "css", "html", "text", "data", "width", "height", "offset"],
            adjacencyOperators = ["after", "prepend", "before", "append"],
            table = document.createElement("table"),
            tableRow = document.createElement("tr"),
            containers = {
                tr: document.createElement("tbody"),
                tbody: table,
                thead: table,
                tfoot: table,
                td: tableRow,
                th: tableRow,
                "*": document.createElement("div")
            },
            readyRE = /complete|loaded|interactive/,
            simpleSelectorRE = /^[\w-]*$/,
            class2type = {},
            toString = class2type.toString,
            zepto = {},
            camelize, uniq, tempParent = document.createElement("div"),
            propMap = {
                tabindex: "tabIndex",
                readonly: "readOnly",
                for: "htmlFor",
                class: "className",
                maxlength: "maxLength",
                cellspacing: "cellSpacing",
                cellpadding: "cellPadding",
                rowspan: "rowSpan",
                colspan: "colSpan",
                usemap: "useMap",
                frameborder: "frameBorder",
                contenteditable: "contentEditable"
            },
            isArray = Array.isArray || function(object) {
                return object instanceof Array
            };
        zepto.matches = function(element, selector) {
            if (!selector || !element || element.nodeType !== 1) return false;
            var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
            if (matchesSelector) return matchesSelector.call(element, selector);
            var match, parent = element.parentNode,
                temp = !parent;
            if (temp)(parent = tempParent).appendChild(element);
            match = ~zepto.qsa(parent, selector).indexOf(element);
            temp && tempParent.removeChild(element);
            return match
        };

        function type(obj) {
            return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"
        }

        function isFunction(value) {
            return type(value) == "function"
        }

        function isWindow(obj) {
            return obj != null && obj == obj.window
        }

        function isDocument(obj) {
            return obj != null && obj.nodeType == obj.DOCUMENT_NODE
        }

        function isObject(obj) {
            return type(obj) == "object"
        }

        function isPlainObject(obj) {
            return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
        }

        function likeArray(obj) {
            return typeof obj.length == "number"
        }

        function compact(array) {
            return filter.call(array, function(item) {
                return item != null
            })
        }

        function flatten(array) {
            return array.length > 0 ? $.fn.concat.apply([], array) : array
        }
        camelize = function(str) {
            return str.replace(/-+(.)?/g, function(match, chr) {
                return chr ? chr.toUpperCase() : ""
            })
        };

        function dasherize(str) {
            return str.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
        }
        uniq = function(array) {
            return filter.call(array, function(item, idx) {
                return array.indexOf(item) == idx
            })
        };

        function classRE(name) {
            return name in classCache ? classCache[name] : classCache[name] = new RegExp("(^|\\s)" + name + "(\\s|$)")
        }

        function maybeAddPx(name, value) {
            return typeof value == "number" && !cssNumber[dasherize(name)] ? value + "px" : value
        }

        function defaultDisplay(nodeName) {
            var element, display;
            if (!elementDisplay[nodeName]) {
                element = document.createElement(nodeName);
                document.body.appendChild(element);
                display = getComputedStyle(element, "").getPropertyValue("display");
                element.parentNode.removeChild(element);
                display == "none" && (display = "block");
                elementDisplay[nodeName] = display
            }
            return elementDisplay[nodeName]
        }

        function children(element) {
            return "children" in element ? slice.call(element.children) : $.map(element.childNodes, function(node) {
                if (node.nodeType == 1) return node
            })
        }
        zepto.fragment = function(html, name, properties) {
            var dom, nodes, container;
            if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1));
            if (!dom) {
                if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
                if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
                if (!(name in containers)) name = "*";
                container = containers[name];
                container.innerHTML = "" + html;
                dom = $.each(slice.call(container.childNodes), function() {
                    container.removeChild(this)
                })
            }
            if (isPlainObject(properties)) {
                nodes = $(dom);
                $.each(properties, function(key, value) {
                    if (methodAttributes.indexOf(key) > -1) nodes[key](value);
                    else nodes.attr(key, value)
                })
            }
            return dom
        };
        zepto.Z = function(dom, selector) {
            dom = dom || [];
            dom.__proto__ = $.fn;
            dom.selector = selector || "";
            return dom
        };
        zepto.isZ = function(object) {
            return object instanceof zepto.Z
        };
        zepto.init = function(selector, context) {
            var dom;
            if (!selector) return zepto.Z();
            else if (typeof selector == "string") {
                selector = selector.trim();
                if (selector[0] == "<" && fragmentRE.test(selector)) dom = zepto.fragment(selector, RegExp.$1, context), selector = null;
                else if (context !== undefined) return $(context).find(selector);
                else dom = zepto.qsa(document, selector)
            } else if (isFunction(selector)) return $(document).ready(selector);
            else if (zepto.isZ(selector)) return selector;
            else {
                if (isArray(selector)) dom = compact(selector);
                else if (isObject(selector)) dom = [selector], selector = null;
                else if (fragmentRE.test(selector)) dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null;
                else if (context !== undefined) return $(context).find(selector);
                else dom = zepto.qsa(document, selector)
            }
            return zepto.Z(dom, selector)
        };
        $ = function(selector, context) {
            return zepto.init(selector, context)
        };

        function extend(target, source, deep) {
            for (key in source)
                if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                    if (isPlainObject(source[key]) && !isPlainObject(target[key])) target[key] = {};
                    if (isArray(source[key]) && !isArray(target[key])) target[key] = [];
                    extend(target[key], source[key], deep)
                } else if (source[key] !== undefined) target[key] = source[key]
        }
        $.extend = function(target) {
            var deep, args = slice.call(arguments, 1);
            if (typeof target == "boolean") {
                deep = target;
                target = args.shift()
            }
            args.forEach(function(arg) {
                extend(target, arg, deep)
            });
            return target
        };
        zepto.qsa = function(element, selector) {
            var found, maybeID = selector[0] == "#",
                maybeClass = !maybeID && selector[0] == ".",
                nameOnly = maybeID || maybeClass ? selector.slice(1) : selector,
                isSimple = simpleSelectorRE.test(nameOnly);
            return isDocument(element) && isSimple && maybeID ? (found = element.getElementById(nameOnly)) ? [found] : [] : element.nodeType !== 1 && element.nodeType !== 9 ? [] : slice.call(isSimple && !maybeID ? maybeClass ? element.getElementsByClassName(nameOnly) : element.getElementsByTagName(selector) : element.querySelectorAll(selector))
        };

        function filtered(nodes, selector) {
            return selector == null ? $(nodes) : $(nodes).filter(selector)
        }
        $.contains = document.documentElement.contains ? function(parent, node) {
            return parent !== node && parent.contains(node)
        } : function(parent, node) {
            while (node && (node = node.parentNode))
                if (node === parent) return true;
            return false
        };

        function funcArg(context, arg, idx, payload) {
            return isFunction(arg) ? arg.call(context, idx, payload) : arg
        }

        function setAttribute(node, name, value) {
            value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
        }

        function className(node, value) {
            var klass = node.className || "",
                svg = klass && klass.baseVal !== undefined;
            if (value === undefined) return svg ? klass.baseVal : klass;
            svg ? klass.baseVal = value : node.className = value
        }

        function deserializeValue(value) {
            try {
                return value ? value == "true" || (value == "false" ? false : value == "null" ? null : +value + "" == value ? +value : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value
            } catch (e) {
                return value
            }
        }
        $.type = type;
        $.isFunction = isFunction;
        $.isWindow = isWindow;
        $.isArray = isArray;
        $.isPlainObject = isPlainObject;
        $.isEmptyObject = function(obj) {
            var name;
            for (name in obj) return false;
            return true
        };
        $.inArray = function(elem, array, i) {
            return emptyArray.indexOf.call(array, elem, i)
        };
        $.camelCase = camelize;
        $.trim = function(str) {
            return str == null ? "" : String.prototype.trim.call(str)
        };
        $.uuid = 0;
        $.support = {};
        $.expr = {};
        $.map = function(elements, callback) {
            var value, values = [],
                i, key;
            if (likeArray(elements))
                for (i = 0; i < elements.length; i++) {
                    value = callback(elements[i], i);
                    if (value != null) values.push(value)
                } else
                    for (key in elements) {
                        value = callback(elements[key], key);
                        if (value != null) values.push(value)
                    }
            return flatten(values)
        };
        $.each = function(elements, callback) {
            var i, key;
            if (likeArray(elements)) {
                for (i = 0; i < elements.length; i++)
                    if (callback.call(elements[i], i, elements[i]) === false) return elements
            } else {
                for (key in elements)
                    if (callback.call(elements[key], key, elements[key]) === false) return elements
            }
            return elements
        };
        $.grep = function(elements, callback) {
            return filter.call(elements, callback)
        };
        if (window.JSON) $.parseJSON = JSON.parse;
        $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase()
        });
        $.fn = {
            forEach: emptyArray.forEach,
            reduce: emptyArray.reduce,
            push: emptyArray.push,
            sort: emptyArray.sort,
            indexOf: emptyArray.indexOf,
            concat: emptyArray.concat,
            map: function(fn) {
                return $($.map(this, function(el, i) {
                    return fn.call(el, i, el)
                }))
            },
            slice: function() {
                return $(slice.apply(this, arguments))
            },
            ready: function(callback) {
                if (readyRE.test(document.readyState) && document.body) callback($);
                else document.addEventListener("DOMContentLoaded", function() {
                    callback($)
                }, false);
                return this
            },
            get: function(idx) {
                return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
            },
            toArray: function() {
                return this.get()
            },
            size: function() {
                return this.length
            },
            remove: function() {
                return this.each(function() {
                    if (this.parentNode != null) this.parentNode.removeChild(this)
                })
            },
            each: function(callback) {
                emptyArray.every.call(this, function(el, idx) {
                    return callback.call(el, idx, el) !== false
                });
                return this
            },
            filter: function(selector) {
                if (isFunction(selector)) return this.not(this.not(selector));
                return $(filter.call(this, function(element) {
                    return zepto.matches(element, selector)
                }))
            },
            add: function(selector, context) {
                return $(uniq(this.concat($(selector, context))))
            },
            is: function(selector) {
                return this.length > 0 && zepto.matches(this[0], selector)
            },
            not: function(selector) {
                var nodes = [];
                if (isFunction(selector) && selector.call !== undefined) this.each(function(idx) {
                    if (!selector.call(this, idx)) nodes.push(this)
                });
                else {
                    var excludes = typeof selector == "string" ? this.filter(selector) : likeArray(selector) && isFunction(selector.item) ? slice.call(selector) : $(selector);
                    this.forEach(function(el) {
                        if (excludes.indexOf(el) < 0) nodes.push(el)
                    })
                }
                return $(nodes)
            },
            has: function(selector) {
                return this.filter(function() {
                    return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size()
                })
            },
            eq: function(idx) {
                return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1)
            },
            first: function() {
                var el = this[0];
                return el && !isObject(el) ? el : $(el)
            },
            last: function() {
                var el = this[this.length - 1];
                return el && !isObject(el) ? el : $(el)
            },
            find: function(selector) {
                var result, $this = this;
                if (!selector) result = $();
                else if (typeof selector == "object") result = $(selector).filter(function() {
                    var node = this;
                    return emptyArray.some.call($this, function(parent) {
                        return $.contains(parent, node)
                    })
                });
                else if (this.length == 1) result = $(zepto.qsa(this[0], selector));
                else result = this.map(function() {
                    return zepto.qsa(this, selector)
                });
                return result
            },
            closest: function(selector, context) {
                var node = this[0],
                    collection = false;
                if (typeof selector == "object") collection = $(selector);
                while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector))) node = node !== context && !isDocument(node) && node.parentNode;
                return $(node)
            },
            parents: function(selector) {
                var ancestors = [],
                    nodes = this;
                while (nodes.length > 0) nodes = $.map(nodes, function(node) {
                    if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
                        ancestors.push(node);
                        return node
                    }
                });
                return filtered(ancestors, selector)
            },
            parent: function(selector) {
                return filtered(uniq(this.pluck("parentNode")), selector)
            },
            children: function(selector) {
                return filtered(this.map(function() {
                    return children(this)
                }), selector)
            },
            contents: function() {
                return this.map(function() {
                    return slice.call(this.childNodes)
                })
            },
            siblings: function(selector) {
                return filtered(this.map(function(i, el) {
                    return filter.call(children(el.parentNode), function(child) {
                        return child !== el
                    })
                }), selector)
            },
            empty: function() {
                return this.each(function() {
                    this.innerHTML = ""
                })
            },
            pluck: function(property) {
                return $.map(this, function(el) {
                    return el[property]
                })
            },
            show: function() {
                return this.each(function() {
                    this.style.display == "none" && (this.style.display = "");
                    if (getComputedStyle(this, "").getPropertyValue("display") == "none") this.style.display = defaultDisplay(this.nodeName)
                })
            },
            replaceWith: function(newContent) {
                return this.before(newContent).remove()
            },
            wrap: function(structure) {
                var func = isFunction(structure);
                if (this[0] && !func) var dom = $(structure).get(0),
                    clone = dom.parentNode || this.length > 1;
                return this.each(function(index) {
                    $(this).wrapAll(func ? structure.call(this, index) : clone ? dom.cloneNode(true) : dom)
                })
            },
            wrapAll: function(structure) {
                if (this[0]) {
                    $(this[0]).before(structure = $(structure));
                    var children;
                    while ((children = structure.children()).length) structure = children.first();
                    $(structure).append(this)
                }
                return this
            },
            wrapInner: function(structure) {
                var func = isFunction(structure);
                return this.each(function(index) {
                    var self = $(this),
                        contents = self.contents(),
                        dom = func ? structure.call(this, index) : structure;
                    contents.length ? contents.wrapAll(dom) : self.append(dom)
                })
            },
            unwrap: function() {
                this.parent().each(function() {
                    $(this).replaceWith($(this).children())
                });
                return this
            },
            clone: function() {
                return this.map(function() {
                    return this.cloneNode(true)
                })
            },
            hide: function() {
                return this.css("display", "none")
            },
            toggle: function(setting) {
                return this.each(function() {
                    var el = $(this);
                    (setting === undefined ? el.css("display") == "none" : setting) ? el.show(): el.hide()
                })
            },
            prev: function(selector) {
                return $(this.pluck("previousElementSibling")).filter(selector || "*")
            },
            next: function(selector) {
                return $(this.pluck("nextElementSibling")).filter(selector || "*")
            },
            html: function(html) {
                return 0 in arguments ? this.each(function(idx) {
                    var originHtml = this.innerHTML;
                    $(this).empty().append(funcArg(this, html, idx, originHtml))
                }) : 0 in this ? this[0].innerHTML : null
            },
            text: function(text) {
                return 0 in arguments ? this.each(function(idx) {
                    var newText = funcArg(this, text, idx, this.textContent);
                    this.textContent = newText == null ? "" : "" + newText
                }) : 0 in this ? this[0].textContent : null
            },
            attr: function(name, value) {
                var result;
                return typeof name == "string" && !(1 in arguments) ? !this.length || this[0].nodeType !== 1 ? undefined : !(result = this[0].getAttribute(name)) && name in this[0] ? this[0][name] : result : this.each(function(idx) {
                    if (this.nodeType !== 1) return;
                    if (isObject(name))
                        for (key in name) setAttribute(this, key, name[key]);
                    else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
                })
            },
            removeAttr: function(name) {
                return this.each(function() {
                    this.nodeType === 1 && name.split(" ").forEach(function(attribute) {
                        setAttribute(this, attribute)
                    }, this)
                })
            },
            prop: function(name, value) {
                name = propMap[name] || name;
                return 1 in arguments ? this.each(function(idx) {
                    this[name] = funcArg(this, value, idx, this[name])
                }) : this[0] && this[0][name]
            },
            data: function(name, value) {
                var attrName = "data-" + name.replace(capitalRE, "-$1").toLowerCase();
                var data = 1 in arguments ? this.attr(attrName, value) : this.attr(attrName);
                return data !== null ? deserializeValue(data) : undefined
            },
            val: function(value) {
                return 0 in arguments ? this.each(function(idx) {
                    this.value = funcArg(this, value, idx, this.value)
                }) : this[0] && (this[0].multiple ? $(this[0]).find("option").filter(function() {
                    return this.selected
                }).pluck("value") : this[0].value)
            },
            offset: function(coordinates) {
                if (coordinates) return this.each(function(index) {
                    var $this = $(this),
                        coords = funcArg(this, coordinates, index, $this.offset()),
                        parentOffset = $this.offsetParent().offset(),
                        props = {
                            top: coords.top - parentOffset.top,
                            left: coords.left - parentOffset.left
                        };
                    if ($this.css("position") == "static") props["position"] = "relative";
                    $this.css(props)
                });
                if (!this.length) return null;
                var obj = this[0].getBoundingClientRect();
                return {
                    left: obj.left + window.pageXOffset,
                    top: obj.top + window.pageYOffset,
                    width: Math.round(obj.width),
                    height: Math.round(obj.height)
                }
            },
            css: function(property, value) {
                if (arguments.length < 2) {
                    var computedStyle, element = this[0];
                    if (!element) return;
                    computedStyle = getComputedStyle(element, "");
                    if (typeof property == "string") return element.style[camelize(property)] || computedStyle.getPropertyValue(property);
                    else if (isArray(property)) {
                        var props = {};
                        $.each(property, function(_, prop) {
                            props[prop] = element.style[camelize(prop)] || computedStyle.getPropertyValue(prop)
                        });
                        return props
                    }
                }
                var css = "";
                if (type(property) == "string") {
                    if (!value && value !== 0) this.each(function() {
                        this.style.removeProperty(dasherize(property))
                    });
                    else css = dasherize(property) + ":" + maybeAddPx(property, value)
                } else {
                    for (key in property)
                        if (!property[key] && property[key] !== 0) this.each(function() {
                            this.style.removeProperty(dasherize(key))
                        });
                        else css += dasherize(key) + ":" + maybeAddPx(key, property[key]) + ";"
                }
                return this.each(function() {
                    this.style.cssText += ";" + css
                })
            },
            index: function(element) {
                return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
            },
            hasClass: function(name) {
                if (!name) return false;
                return emptyArray.some.call(this, function(el) {
                    return this.test(className(el))
                }, classRE(name))
            },
            addClass: function(name) {
                if (!name) return this;
                return this.each(function(idx) {
                    if (!("className" in this)) return;
                    classList = [];
                    var cls = className(this),
                        newName = funcArg(this, name, idx, cls);
                    newName.split(/\s+/g).forEach(function(klass) {
                        if (!$(this).hasClass(klass)) classList.push(klass)
                    }, this);
                    classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
                })
            },
            removeClass: function(name) {
                return this.each(function(idx) {
                    if (!("className" in this)) return;
                    if (name === undefined) return className(this, "");
                    classList = className(this);
                    funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass) {
                        classList = classList.replace(classRE(klass), " ")
                    });
                    className(this, classList.trim())
                })
            },
            toggleClass: function(name, when) {
                if (!name) return this;
                return this.each(function(idx) {
                    var $this = $(this),
                        names = funcArg(this, name, idx, className(this));
                    names.split(/\s+/g).forEach(function(klass) {
                        (when === undefined ? !$this.hasClass(klass) : when) ? $this.addClass(klass): $this.removeClass(klass)
                    })
                })
            },
            scrollTop: function(value) {
                if (!this.length) return;
                var hasScrollTop = "scrollTop" in this[0];
                if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
                return this.each(hasScrollTop ? function() {
                    this.scrollTop = value
                } : function() {
                    this.scrollTo(this.scrollX, value)
                })
            },
            scrollLeft: function(value) {
                if (!this.length) return;
                var hasScrollLeft = "scrollLeft" in this[0];
                if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
                return this.each(hasScrollLeft ? function() {
                    this.scrollLeft = value
                } : function() {
                    this.scrollTo(value, this.scrollY)
                })
            },
            position: function() {
                if (!this.length) return;
                var elem = this[0],
                    offsetParent = this.offsetParent(),
                    offset = this.offset(),
                    parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {
                        top: 0,
                        left: 0
                    } : offsetParent.offset();
                offset.top -= parseFloat($(elem).css("margin-top")) || 0;
                offset.left -= parseFloat($(elem).css("margin-left")) || 0;
                parentOffset.top += parseFloat($(offsetParent[0]).css("border-top-width")) || 0;
                parentOffset.left += parseFloat($(offsetParent[0]).css("border-left-width")) || 0;
                return {
                    top: offset.top - parentOffset.top,
                    left: offset.left - parentOffset.left
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    var parent = this.offsetParent || document.body;
                    while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static") parent = parent.offsetParent;
                    return parent
                })
            }
        };
        $.fn.detach = $.fn.remove;
        ["width", "height"].forEach(function(dimension) {
            var dimensionProperty = dimension.replace(/./, function(m) {
                return m[0].toUpperCase()
            });
            $.fn[dimension] = function(value) {
                var offset, el = this[0];
                if (value === undefined) return isWindow(el) ? el["inner" + dimensionProperty] : isDocument(el) ? el.documentElement["scroll" + dimensionProperty] : (offset = this.offset()) && offset[dimension];
                else return this.each(function(idx) {
                    el = $(this);
                    el.css(dimension, funcArg(this, value, idx, el[dimension]()))
                })
            }
        });

        function traverseNode(node, fun) {
            fun(node);
            for (var i = 0, len = node.childNodes.length; i < len; i++) traverseNode(node.childNodes[i], fun)
        }
        adjacencyOperators.forEach(function(operator, operatorIndex) {
            var inside = operatorIndex % 2;
            $.fn[operator] = function() {
                var argType, nodes = $.map(arguments, function(arg) {
                        argType = type(arg);
                        return argType == "object" || argType == "array" || arg == null ? arg : zepto.fragment(arg)
                    }),
                    parent, copyByClone = this.length > 1;
                if (nodes.length < 1) return this;
                return this.each(function(_, target) {
                    parent = inside ? target : target.parentNode;
                    target = operatorIndex == 0 ? target.nextSibling : operatorIndex == 1 ? target.firstChild : operatorIndex == 2 ? target : null;
                    var parentInDocument = $.contains(document.documentElement, parent);
                    nodes.forEach(function(node) {
                        if (copyByClone) node = node.cloneNode(true);
                        else if (!parent) return $(node).remove();
                        parent.insertBefore(node, target);
                        if (parentInDocument) traverseNode(node, function(el) {
                            if (el.nodeName != null && el.nodeName.toUpperCase() === "SCRIPT" && (!el.type || el.type === "text/javascript") && !el.src) window["eval"].call(window, el.innerHTML)
                        })
                    })
                })
            };
            $.fn[inside ? operator + "To" : "insert" + (operatorIndex ? "Before" : "After")] = function(html) {
                $(html)[operator](this);
                return this
            }
        });
        zepto.Z.prototype = $.fn;
        zepto.uniq = uniq;
        zepto.deserializeValue = deserializeValue;
        $.zepto = zepto;
        return $
    }();
    window.Zepto = Zepto;
    window.$ === undefined && (window.$ = Zepto);
    (function($) {
        var _zid = 1,
            undefined, slice = Array.prototype.slice,
            isFunction = $.isFunction,
            isString = function(obj) {
                return typeof obj == "string"
            },
            handlers = {},
            specialEvents = {},
            focusinSupported = "onfocusin" in window,
            focus = {
                focus: "focusin",
                blur: "focusout"
            },
            hover = {
                mouseenter: "mouseover",
                mouseleave: "mouseout"
            };
        specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = "MouseEvents";

        function zid(element) {
            return element._zid || (element._zid = _zid++)
        }

        function findHandlers(element, event, fn, selector) {
            event = parse(event);
            if (event.ns) var matcher = matcherFor(event.ns);
            return (handlers[zid(element)] || []).filter(function(handler) {
                return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector)
            })
        }

        function parse(event) {
            var parts = ("" + event).split(".");
            return {
                e: parts[0],
                ns: parts.slice(1).sort().join(" ")
            }
        }

        function matcherFor(ns) {
            return new RegExp("(?:^| )" + ns.replace(" ", " .* ?") + "(?: |$)")
        }

        function eventCapture(handler, captureSetting) {
            return handler.del && (!focusinSupported && handler.e in focus) || !!captureSetting
        }

        function realEvent(type) {
            return hover[type] || focusinSupported && focus[type] || type
        }

        function add(element, events, fn, data, selector, delegator, capture) {
            var id = zid(element),
                set = handlers[id] || (handlers[id] = []);
            events.split(/\s/).forEach(function(event) {
                if (event == "ready") return $(document).ready(fn);
                var handler = parse(event);
                handler.fn = fn;
                handler.sel = selector;
                if (handler.e in hover) fn = function(e) {
                    var related = e.relatedTarget;
                    if (!related || related !== this && !$.contains(this, related)) return handler.fn.apply(this, arguments)
                };
                handler.del = delegator;
                var callback = delegator || fn;
                handler.proxy = function(e) {
                    e = compatible(e);
                    if (e.isImmediatePropagationStopped()) return;
                    e.data = data;
                    var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args));
                    if (result === false) e.preventDefault(), e.stopPropagation();
                    return result
                };
                handler.i = set.length;
                set.push(handler);
                if ("addEventListener" in element) element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
            })
        }

        function remove(element, events, fn, selector, capture) {
            var id = zid(element);
            (events || "").split(/\s/).forEach(function(event) {
                findHandlers(element, event, fn, selector).forEach(function(handler) {
                    delete handlers[id][handler.i];
                    if ("removeEventListener" in element) element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
                })
            })
        }
        $.event = {
            add: add,
            remove: remove
        };
        $.proxy = function(fn, context) {
            var args = 2 in arguments && slice.call(arguments, 2);
            if (isFunction(fn)) {
                var proxyFn = function() {
                    return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments)
                };
                proxyFn._zid = zid(fn);
                return proxyFn
            } else if (isString(context)) {
                if (args) {
                    args.unshift(fn[context], fn);
                    return $.proxy.apply(null, args)
                } else {
                    return $.proxy(fn[context], fn)
                }
            } else {
                throw new TypeError("expected function")
            }
        };
        $.fn.bind = function(event, data, callback) {
            return this.on(event, data, callback)
        };
        $.fn.unbind = function(event, callback) {
            return this.off(event, callback)
        };
        $.fn.one = function(event, selector, data, callback) {
            return this.on(event, selector, data, callback, 1)
        };
        var returnTrue = function() {
                return true
            },
            returnFalse = function() {
                return false
            },
            ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
            eventMethods = {
                preventDefault: "isDefaultPrevented",
                stopImmediatePropagation: "isImmediatePropagationStopped",
                stopPropagation: "isPropagationStopped"
            };

        function compatible(event, source) {
            if (source || !event.isDefaultPrevented) {
                source || (source = event);
                $.each(eventMethods, function(name, predicate) {
                    var sourceMethod = source[name];
                    event[name] = function() {
                        this[predicate] = returnTrue;
                        return sourceMethod && sourceMethod.apply(source, arguments)
                    };
                    event[predicate] = returnFalse
                });
                if (source.defaultPrevented !== undefined ? source.defaultPrevented : "returnValue" in source ? source.returnValue === false : source.getPreventDefault && source.getPreventDefault()) event.isDefaultPrevented = returnTrue
            }
            return event
        }

        function createProxy(event) {
            var key, proxy = {
                originalEvent: event
            };
            for (key in event)
                if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key];
            return compatible(proxy, event)
        }
        $.fn.delegate = function(selector, event, callback) {
            return this.on(event, selector, callback)
        };
        $.fn.undelegate = function(selector, event, callback) {
            return this.off(event, selector, callback)
        };
        $.fn.live = function(event, callback) {
            $(document.body).delegate(this.selector, event, callback);
            return this
        };
        $.fn.die = function(event, callback) {
            $(document.body).undelegate(this.selector, event, callback);
            return this
        };
        $.fn.on = function(event, selector, data, callback, one) {
            var autoRemove, delegator, $this = this;
            if (event && !isString(event)) {
                $.each(event, function(type, fn) {
                    $this.on(type, selector, data, fn, one)
                });
                return $this
            }
            if (!isString(selector) && !isFunction(callback) && callback !== false) callback = data, data = selector, selector = undefined;
            if (isFunction(data) || data === false) callback = data, data = undefined;
            if (callback === false) callback = returnFalse;
            return $this.each(function(_, element) {
                if (one) autoRemove = function(e) {
                    remove(element, e.type, callback);
                    return callback.apply(this, arguments)
                };
                if (selector) delegator = function(e) {
                    var evt, match = $(e.target).closest(selector, element).get(0);
                    if (match && match !== element) {
                        evt = $.extend(createProxy(e), {
                            currentTarget: match,
                            liveFired: element
                        });
                        return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
                    }
                };
                add(element, event, callback, data, selector, delegator || autoRemove)
            })
        };
        $.fn.off = function(event, selector, callback) {
            var $this = this;
            if (event && !isString(event)) {
                $.each(event, function(type, fn) {
                    $this.off(type, selector, fn)
                });
                return $this
            }
            if (!isString(selector) && !isFunction(callback) && callback !== false) callback = selector, selector = undefined;
            if (callback === false) callback = returnFalse;
            return $this.each(function() {
                remove(this, event, callback, selector)
            })
        };
        $.fn.trigger = function(event, args) {
            event = isString(event) || $.isPlainObject(event) ? $.Event(event) : compatible(event);
            event._args = args;
            return this.each(function() {
                if (event.type in focus && typeof this[event.type] == "function") this[event.type]();
                else if ("dispatchEvent" in this) this.dispatchEvent(event);
                else $(this).triggerHandler(event, args)
            })
        };
        $.fn.triggerHandler = function(event, args) {
            var e, result;
            this.each(function(i, element) {
                e = createProxy(isString(event) ? $.Event(event) : event);
                e._args = args;
                e.target = element;
                $.each(findHandlers(element, event.type || event), function(i, handler) {
                    result = handler.proxy(e);
                    if (e.isImmediatePropagationStopped()) return false
                })
            });
            return result
        };
        ("focusin focusout focus blur load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select keydown keypress keyup error").split(" ").forEach(function(event) {
            $.fn[event] = function(callback) {
                return 0 in arguments ? this.bind(event, callback) : this.trigger(event)
            }
        });
        $.Event = function(type, props) {
            if (!isString(type)) props = type, type = props.type;
            var event = document.createEvent(specialEvents[type] || "Events"),
                bubbles = true;
            if (props)
                for (var name in props) name == "bubbles" ? bubbles = !!props[name] : event[name] = props[name];
            event.initEvent(type, bubbles, true);
            return compatible(event)
        }
    })(Zepto);
    (function($) {
        var jsonpID = 0,
            document = window.document,
            key, name, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            scriptTypeRE = /^(?:text|application)\/javascript/i,
            xmlTypeRE = /^(?:text|application)\/xml/i,
            jsonType = "application/json",
            htmlType = "text/html",
            blankRE = /^\s*$/,
            originAnchor = document.createElement("a");
        originAnchor.href = window.location.href;

        function triggerAndReturn(context, eventName, data) {
            var event = $.Event(eventName);
            $(context).trigger(event, data);
            return !event.isDefaultPrevented()
        }

        function triggerGlobal(settings, context, eventName, data) {
            if (settings.global) return triggerAndReturn(context || document, eventName, data)
        }
        $.active = 0;

        function ajaxStart(settings) {
            if (settings.global && $.active++ === 0) triggerGlobal(settings, null, "ajaxStart")
        }

        function ajaxStop(settings) {
            if (settings.global && !--$.active) triggerGlobal(settings, null, "ajaxStop")
        }

        function ajaxBeforeSend(xhr, settings) {
            var context = settings.context;
            if (settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, "ajaxBeforeSend", [xhr, settings]) === false) return false;
            triggerGlobal(settings, context, "ajaxSend", [xhr, settings])
        }

        function ajaxSuccess(data, xhr, settings, deferred) {
            var context = settings.context,
                status = "success";
            settings.success.call(context, data, status, xhr);
            if (deferred) deferred.resolveWith(context, [data, status, xhr]);
            triggerGlobal(settings, context, "ajaxSuccess", [xhr, settings, data]);
            ajaxComplete(status, xhr, settings)
        }

        function ajaxError(error, type, xhr, settings, deferred) {
            var context = settings.context;
            settings.error.call(context, xhr, type, error);
            if (deferred) deferred.rejectWith(context, [xhr, type, error]);
            triggerGlobal(settings, context, "ajaxError", [xhr, settings, error || type]);
            ajaxComplete(type, xhr, settings)
        }

        function ajaxComplete(status, xhr, settings) {
            var context = settings.context;
            settings.complete.call(context, xhr, status);
            triggerGlobal(settings, context, "ajaxComplete", [xhr, settings]);
            ajaxStop(settings)
        }

        function empty() {}
        $.ajaxJSONP = function(options, deferred) {
            if (!("type" in options)) return $.ajax(options);
            var _callbackName = options.jsonpCallback,
                callbackName = ($.isFunction(_callbackName) ? _callbackName() : _callbackName) || "jsonp" + ++jsonpID,
                script = document.createElement("script"),
                originalCallback = window[callbackName],
                responseData, abort = function(errorType) {
                    $(script).triggerHandler("error", errorType || "abort")
                },
                xhr = {
                    abort: abort
                },
                abortTimeout;
            if (deferred) deferred.promise(xhr);
            $(script).on("load error", function(e, errorType) {
                clearTimeout(abortTimeout);
                $(script).off().remove();
                if (e.type == "error" || !responseData) {
                    ajaxError(null, errorType || "error", xhr, options, deferred)
                } else {
                    ajaxSuccess(responseData[0], xhr, options, deferred)
                }
                window[callbackName] = originalCallback;
                if (responseData && $.isFunction(originalCallback)) originalCallback(responseData[0]);
                originalCallback = responseData = undefined
            });
            if (ajaxBeforeSend(xhr, options) === false) {
                abort("abort");
                return xhr
            }
            window[callbackName] = function() {
                responseData = arguments
            };
            script.src = options.url.replace(/\?(.+)=\?/, "?$1=" + callbackName);
            document.head.appendChild(script);
            if (options.timeout > 0) abortTimeout = setTimeout(function() {
                abort("timeout")
            }, options.timeout);
            return xhr
        };
        $.ajaxSettings = {
            type: "GET",
            beforeSend: empty,
            success: empty,
            error: empty,
            complete: empty,
            context: null,
            global: true,
            xhr: function() {
                return new window.XMLHttpRequest
            },
            accepts: {
                script: "text/javascript, application/javascript, application/x-javascript",
                json: jsonType,
                xml: "application/xml, text/xml",
                html: htmlType,
                text: "text/plain"
            },
            crossDomain: false,
            timeout: 0,
            processData: true,
            cache: true
        };

        function mimeToDataType(mime) {
            if (mime) mime = mime.split(";", 2)[0];
            return mime && (mime == htmlType ? "html" : mime == jsonType ? "json" : scriptTypeRE.test(mime) ? "script" : xmlTypeRE.test(mime) && "xml") || "text"
        }

        function appendQuery(url, query) {
            if (query == "") return url;
            return (url + "&" + query).replace(/[&?]{1,2}/, "?")
        }

        function serializeData(options) {
            if (options.processData && options.data && $.type(options.data) != "string") options.data = $.param(options.data, options.traditional);
            if (options.data && (!options.type || options.type.toUpperCase() == "GET")) options.url = appendQuery(options.url, options.data),
                options.data = undefined
        }
        $.ajax = function(options) {
            var settings = $.extend({}, options || {}),
                deferred = $.Deferred && $.Deferred(),
                urlAnchor;
            for (key in $.ajaxSettings)
                if (settings[key] === undefined) settings[key] = $.ajaxSettings[key];
            ajaxStart(settings);
            if (!settings.crossDomain) {
                urlAnchor = document.createElement("a");
                urlAnchor.href = settings.url;
                urlAnchor.href = urlAnchor.href;
                settings.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host
            }
            if (!settings.url) settings.url = window.location.toString();
            serializeData(settings);
            var dataType = settings.dataType,
                hasPlaceholder = /\?.+=\?/.test(settings.url);
            if (hasPlaceholder) dataType = "jsonp";
            if (settings.cache === false || (!options || options.cache !== true) && ("script" == dataType || "jsonp" == dataType)) settings.url = appendQuery(settings.url, "_=" + Date.now());
            if ("jsonp" == dataType) {
                if (!hasPlaceholder) settings.url = appendQuery(settings.url, settings.jsonp ? settings.jsonp + "=?" : settings.jsonp === false ? "" : "callback=?");
                return $.ajaxJSONP(settings, deferred)
            }
            var mime = settings.accepts[dataType],
                headers = {},
                setHeader = function(name, value) {
                    headers[name.toLowerCase()] = [name, value]
                },
                protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
                xhr = settings.xhr(),
                nativeSetHeader = xhr.setRequestHeader,
                abortTimeout;
            if (deferred) deferred.promise(xhr);
            if (!settings.crossDomain) setHeader("X-Requested-With", "XMLHttpRequest");
            setHeader("Accept", mime || "*/*");
            if (mime = settings.mimeType || mime) {
                if (mime.indexOf(",") > -1) mime = mime.split(",", 2)[0];
                xhr.overrideMimeType && xhr.overrideMimeType(mime)
            }
            if (settings.contentType || settings.contentType !== false && settings.data && settings.type.toUpperCase() != "GET") setHeader("Content-Type", settings.contentType || "application/x-www-form-urlencoded");
            if (settings.headers)
                for (name in settings.headers) setHeader(name, settings.headers[name]);
            xhr.setRequestHeader = setHeader;
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    xhr.onreadystatechange = empty;
                    clearTimeout(abortTimeout);
                    var result, error = false;
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0 && protocol == "file:") {
                        dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader("content-type"));
                        result = xhr.responseText;
                        try {
                            if (dataType == "script")(1, eval)(result);
                            else if (dataType == "xml") result = xhr.responseXML;
                            else if (dataType == "json") result = blankRE.test(result) ? null : $.parseJSON(result)
                        } catch (e) {
                            error = e
                        }
                        if (error) ajaxError(error, "parsererror", xhr, settings, deferred);
                        else ajaxSuccess(result, xhr, settings, deferred)
                    } else {
                        ajaxError(xhr.statusText || null, xhr.status ? "error" : "abort", xhr, settings, deferred)
                    }
                }
            };
            if (ajaxBeforeSend(xhr, settings) === false) {
                xhr.abort();
                ajaxError(null, "abort", xhr, settings, deferred);
                return xhr
            }
            if (settings.xhrFields)
                for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name];
            var async = "async" in settings ? settings.async : true;
            xhr.open(settings.type, settings.url, async, settings.username, settings.password);
            for (name in headers) nativeSetHeader.apply(xhr, headers[name]);
            if (settings.timeout > 0) abortTimeout = setTimeout(function() {
                xhr.onreadystatechange = empty;
                xhr.abort();
                ajaxError(null, "timeout", xhr, settings, deferred)
            }, settings.timeout);
            xhr.send(settings.data ? settings.data : null);
            return xhr
        };

        function parseArguments(url, data, success, dataType) {
            if ($.isFunction(data)) dataType = success, success = data, data = undefined;
            if (!$.isFunction(success)) dataType = success, success = undefined;
            return {
                url: url,
                data: data,
                success: success,
                dataType: dataType
            }
        }
        $.get = function() {
            return $.ajax(parseArguments.apply(null, arguments))
        };
        $.post = function() {
            var options = parseArguments.apply(null, arguments);
            options.type = "POST";
            return $.ajax(options)
        };
        $.getJSON = function() {
            var options = parseArguments.apply(null, arguments);
            options.dataType = "json";
            return $.ajax(options)
        };
        $.fn.load = function(url, data, success) {
            if (!this.length) return this;
            var self = this,
                parts = url.split(/\s/),
                selector, options = parseArguments(url, data, success),
                callback = options.success;
            if (parts.length > 1) options.url = parts[0], selector = parts[1];
            options.success = function(response) {
                self.html(selector ? $("<div>").html(response.replace(rscript, "")).find(selector) : response);
                callback && callback.apply(self, arguments)
            };
            $.ajax(options);
            return this
        };
        var escape = encodeURIComponent;

        function serialize(params, obj, traditional, scope) {
            var type, array = $.isArray(obj),
                hash = $.isPlainObject(obj);
            $.each(obj, function(key, value) {
                type = $.type(value);
                if (scope) key = traditional ? scope : scope + "[" + (hash || type == "object" || type == "array" ? key : "") + "]";
                if (!scope && array) params.add(value.name, value.value);
                else if (type == "array" || !traditional && type == "object") serialize(params, value, traditional, key);
                else params.add(key, value)
            })
        }
        $.param = function(obj, traditional) {
            var params = [];
            params.add = function(key, value) {
                if ($.isFunction(value)) value = value();
                if (value == null) value = "";
                this.push(escape(key) + "=" + escape(value))
            };
            serialize(params, obj, traditional);
            return params.join("&").replace(/%20/g, "+")
        }
    })(Zepto);
    (function($) {
        $.fn.serializeArray = function() {
            var name, type, result = [],
                add = function(value) {
                    if (value.forEach) return value.forEach(add);
                    result.push({
                        name: name,
                        value: value
                    })
                };
            if (this[0]) $.each(this[0].elements, function(_, field) {
                type = field.type, name = field.name;
                if (name && field.nodeName.toLowerCase() != "fieldset" && !field.disabled && type != "submit" && type != "reset" && type != "button" && type != "file" && (type != "radio" && type != "checkbox" || field.checked)) add($(field).val())
            });
            return result
        };
        $.fn.serialize = function() {
            var result = [];
            this.serializeArray().forEach(function(elm) {
                result.push(encodeURIComponent(elm.name) + "=" + encodeURIComponent(elm.value))
            });
            return result.join("&")
        };
        $.fn.submit = function(callback) {
            if (0 in arguments) this.bind("submit", callback);
            else if (this.length) {
                var event = $.Event("submit");
                this.eq(0).trigger(event);
                if (!event.isDefaultPrevented()) this.get(0).submit()
            }
            return this
        }
    })(Zepto);
    (function($) {
        if (!("__proto__" in {})) {
            $.extend($.zepto, {
                Z: function(dom, selector) {
                    dom = dom || [];
                    $.extend(dom, $.fn);
                    dom.selector = selector || "";
                    dom.__Z = true;
                    return dom
                },
                isZ: function(object) {
                    return $.type(object) === "array" && "__Z" in object
                }
            })
        }
        try {
            getComputedStyle(undefined)
        } catch (e) {
            var nativeGetComputedStyle = getComputedStyle;
            window.getComputedStyle = function(element) {
                try {
                    return nativeGetComputedStyle(element)
                } catch (e) {
                    return null
                }
            }
        }
    })(Zepto);
    module.exports = Zepto
});
define("xg/jx-business/1.0.0/c/js/base/zepto-debug.touch", [], function(require, exports, module) {
    (function($) {
        var touch = {},
            touchTimeout, tapTimeout, swipeTimeout, longTapTimeout, longTapDelay = 750,
            gesture;

        function swipeDirection(x1, x2, y1, y2) {
            return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? "Left" : "Right" : y1 - y2 > 0 ? "Up" : "Down"
        }

        function longTap() {
            longTapTimeout = null;
            if (touch.last) {
                touch.el.trigger("longTap");
                touch = {}
            }
        }

        function cancelLongTap() {
            if (longTapTimeout) clearTimeout(longTapTimeout);
            longTapTimeout = null
        }

        function cancelAll() {
            if (touchTimeout) clearTimeout(touchTimeout);
            if (tapTimeout) clearTimeout(tapTimeout);
            if (swipeTimeout) clearTimeout(swipeTimeout);
            if (longTapTimeout) clearTimeout(longTapTimeout);
            touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
            touch = {}
        }

        function isPrimaryTouch(event) {
            return (event.pointerType == "touch" || event.pointerType == event.MSPOINTER_TYPE_TOUCH) && event.isPrimary
        }

        function isPointerEventType(e, type) {
            return e.type == "pointer" + type || e.type.toLowerCase() == "mspointer" + type
        }
        $(document).ready(function() {
            var now, delta, deltaX = 0,
                deltaY = 0,
                firstTouch, _isPointerType;
            if ("MSGesture" in window) {
                gesture = new MSGesture;
                gesture.target = document.body
            }
            $(document).bind("MSGestureEnd", function(e) {
                var swipeDirectionFromVelocity = e.velocityX > 1 ? "Right" : e.velocityX < -1 ? "Left" : e.velocityY > 1 ? "Down" : e.velocityY < -1 ? "Up" : null;
                if (swipeDirectionFromVelocity) {
                    touch.el.trigger("swipe");
                    touch.el.trigger("swipe" + swipeDirectionFromVelocity)
                }
            }).on("touchstart MSPointerDown pointerdown", function(e) {
                if ((_isPointerType = isPointerEventType(e, "down")) && !isPrimaryTouch(e)) return;
                firstTouch = _isPointerType ? e : e.touches[0];
                if (e.touches && e.touches.length === 1 && touch.x2) {
                    touch.x2 = undefined;
                    touch.y2 = undefined
                }
                now = Date.now();
                delta = now - (touch.last || now);
                touch.el = $("tagName" in firstTouch.target ? firstTouch.target : firstTouch.target.parentNode);
                touchTimeout && clearTimeout(touchTimeout);
                touch.x1 = firstTouch.pageX;
                touch.y1 = firstTouch.pageY;
                if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
                touch.last = now;
                longTapTimeout = setTimeout(longTap, longTapDelay);
                if (gesture && _isPointerType) gesture.addPointer(e.pointerId)
            }).on("touchmove MSPointerMove pointermove", function(e) {
                if ((_isPointerType = isPointerEventType(e, "move")) && !isPrimaryTouch(e)) return;
                firstTouch = _isPointerType ? e : e.touches[0];
                cancelLongTap();
                touch.x2 = firstTouch.pageX;
                touch.y2 = firstTouch.pageY;
                deltaX += Math.abs(touch.x1 - touch.x2);
                deltaY += Math.abs(touch.y1 - touch.y2)
            }).on("touchend MSPointerUp pointerup", function(e) {
                if ((_isPointerType = isPointerEventType(e, "up")) && !isPrimaryTouch(e)) return;
                cancelLongTap();
                if (touch.x2 && Math.abs(touch.x1 - touch.x2) > 30 || touch.y2 && Math.abs(touch.y1 - touch.y2) > 30) swipeTimeout = setTimeout(function() {
                    touch.el.trigger("swipe");
                    touch.el.trigger("swipe" + swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2));
                    touch = {}
                }, 0);
                else if ("last" in touch)
                    if (deltaX < 30 && deltaY < 30) {
                        tapTimeout = setTimeout(function() {
                            var event = $.Event("tap");
                            event.cancelTouch = cancelAll;
                            touch.el.trigger(event);
                            if (touch.isDoubleTap) {
                                if (touch.el) touch.el.trigger("doubleTap");
                                touch = {}
                            } else {
                                touchTimeout = setTimeout(function() {
                                    touchTimeout = null;
                                    if (touch.el) touch.el.trigger("singleTap");
                                    touch = {}
                                }, 250)
                            }
                        }, 0)
                    } else {
                        touch = {}
                    }
                deltaX = deltaY = 0
            }).on("touchcancel MSPointerCancel pointercancel", cancelAll);
            $(window).on("scroll", cancelAll)
        });
        ["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap"].forEach(function(eventName) {
            $.fn[eventName] = function(callback) {
                return this.on(eventName, callback)
            }
        })
    })(Zepto)
});
define("xg/jx-business/1.0.0/c/js/base/zepto-debug.deferred", [], function(require, exports, module) {
    (function($) {
        var slice = Array.prototype.slice;

        function Deferred(func) {
            var tuples = [
                    ["resolve", "done", $.Callbacks({
                        once: 1,
                        memory: 1
                    }), "resolved"],
                    ["reject", "fail", $.Callbacks({
                        once: 1,
                        memory: 1
                    }), "rejected"],
                    ["notify", "progress", $.Callbacks({
                        memory: 1
                    })]
                ],
                state = "pending",
                promise = {
                    state: function() {
                        return state
                    },
                    always: function() {
                        deferred.done(arguments).fail(arguments);
                        return this
                    },
                    then: function() {
                        var fns = arguments;
                        return Deferred(function(defer) {
                            $.each(tuples, function(i, tuple) {
                                var fn = $.isFunction(fns[i]) && fns[i];
                                deferred[tuple[1]](function() {
                                    var returned = fn && fn.apply(this, arguments);
                                    if (returned && $.isFunction(returned.promise)) {
                                        returned.promise().done(defer.resolve).fail(defer.reject).progress(defer.notify)
                                    } else {
                                        var context = this === promise ? defer.promise() : this,
                                            values = fn ? [returned] : arguments;
                                        defer[tuple[0] + "With"](context, values)
                                    }
                                })
                            });
                            fns = null
                        }).promise()
                    },
                    promise: function(obj) {
                        return obj != null ? $.extend(obj, promise) : promise
                    }
                },
                deferred = {};
            $.each(tuples, function(i, tuple) {
                var list = tuple[2],
                    stateString = tuple[3];
                promise[tuple[1]] = list.add;
                if (stateString) {
                    list.add(function() {
                        state = stateString
                    }, tuples[i ^ 1][2].disable, tuples[2][2].lock)
                }
                deferred[tuple[0]] = function() {
                    deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
                    return this
                };
                deferred[tuple[0] + "With"] = list.fireWith
            });
            promise.promise(deferred);
            if (func) func.call(deferred, deferred);
            return deferred
        }
        $.when = function(sub) {
            var resolveValues = slice.call(arguments),
                len = resolveValues.length,
                i = 0,
                remain = len !== 1 || sub && $.isFunction(sub.promise) ? len : 0,
                deferred = remain === 1 ? sub : Deferred(),
                progressValues, progressContexts, resolveContexts, updateFn = function(i, ctx, val) {
                    return function(value) {
                        ctx[i] = this;
                        val[i] = arguments.length > 1 ? slice.call(arguments) : value;
                        if (val === progressValues) {
                            deferred.notifyWith(ctx, val)
                        } else if (!--remain) {
                            deferred.resolveWith(ctx, val)
                        }
                    }
                };
            if (len > 1) {
                progressValues = new Array(len);
                progressContexts = new Array(len);
                resolveContexts = new Array(len);
                for (; i < len; ++i) {
                    if (resolveValues[i] && $.isFunction(resolveValues[i].promise)) {
                        resolveValues[i].promise().done(updateFn(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFn(i, progressContexts, progressValues))
                    } else {
                        --remain
                    }
                }
            }
            if (!remain) deferred.resolveWith(resolveContexts, resolveValues);
            return deferred.promise()
        };
        $.Deferred = Deferred
    })(Zepto);
    module.exports = Zepto
});
define("xg/jx-business/1.0.0/c/js/base/zepto-debug.callbacks", [], function(require, exports, module) {
    (function($) {
        $.Callbacks = function(options) {
            options = $.extend({}, options);
            var memory, fired, firing, firingStart, firingLength, firingIndex, list = [],
                stack = !options.once && [],
                fire = function(data) {
                    memory = options.memory && data;
                    fired = true;
                    firingIndex = firingStart || 0;
                    firingStart = 0;
                    firingLength = list.length;
                    firing = true;
                    for (; list && firingIndex < firingLength; ++firingIndex) {
                        if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                            memory = false;
                            break
                        }
                    }
                    firing = false;
                    if (list) {
                        if (stack) stack.length && fire(stack.shift());
                        else if (memory) list.length = 0;
                        else Callbacks.disable()
                    }
                },
                Callbacks = {
                    add: function() {
                        if (list) {
                            var start = list.length,
                                add = function(args) {
                                    $.each(args, function(_, arg) {
                                        if (typeof arg === "function") {
                                            if (!options.unique || !Callbacks.has(arg)) list.push(arg)
                                        } else if (arg && arg.length && typeof arg !== "string") add(arg)
                                    })
                                };
                            add(arguments);
                            if (firing) firingLength = list.length;
                            else if (memory) {
                                firingStart = start;
                                fire(memory)
                            }
                        }
                        return this
                    },
                    remove: function() {
                        if (list) {
                            $.each(arguments, function(_, arg) {
                                var index;
                                while ((index = $.inArray(arg, list, index)) > -1) {
                                    list.splice(index, 1);
                                    if (firing) {
                                        if (index <= firingLength) --firingLength;
                                        if (index <= firingIndex) --firingIndex
                                    }
                                }
                            })
                        }
                        return this
                    },
                    has: function(fn) {
                        return !!(list && (fn ? $.inArray(fn, list) > -1 : list.length))
                    },
                    empty: function() {
                        firingLength = list.length = 0;
                        return this
                    },
                    disable: function() {
                        list = stack = memory = undefined;
                        return this
                    },
                    disabled: function() {
                        return !list
                    },
                    lock: function() {
                        stack = undefined;
                        if (!memory) Callbacks.disable();
                        return this
                    },
                    locked: function() {
                        return !stack
                    },
                    fireWith: function(context, args) {
                        if (list && (!fired || stack)) {
                            args = args || [];
                            args = [context, args.slice ? args.slice() : args];
                            if (firing) stack.push(args);
                            else fire(args)
                        }
                        return this
                    },
                    fire: function() {
                        return Callbacks.fireWith(this, arguments)
                    },
                    fired: function() {
                        return !!fired
                    }
                };
            return Callbacks
        }
    })(Zepto);
    module.exports = Zepto
});
define("xg/jx-business/1.0.0/c/js/base/sm-debug", [], function(require, exports, module) {
    $.smVersion = "0.5.4"; + function($) {
        "use strict";
        var defaults = {
            autoInit: false,
            showPageLoadingIndicator: true,
            router: true,
            swipePanel: "left",
            swipePanelOnlyClose: false,
            pushAnimationDuration: 400
        };
        $.smConfig = $.extend(defaults, $.config)
    }(Zepto);
    (function($) {
        "use strict";
        var device = {};
        var ua = navigator.userAgent;
        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
        device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;
        if (android) {
            device.os = "android";
            device.osVersion = android[2];
            device.android = true;
            device.androidChrome = ua.toLowerCase().indexOf("chrome") >= 0
        }
        if (ipad || iphone || ipod) {
            device.os = "ios";
            device.ios = true
        }
        if (iphone && !ipod) {
            device.osVersion = iphone[2].replace(/_/g, ".");
            device.iphone = true
        }
        if (ipad) {
            device.osVersion = ipad[2].replace(/_/g, ".");
            device.ipad = true
        }
        if (ipod) {
            device.osVersion = ipod[3] ? ipod[3].replace(/_/g, ".") : null;
            device.iphone = true
        }
        if (device.ios && device.osVersion && ua.indexOf("Version/") >= 0) {
            if (device.osVersion.split(".")[0] === "10") {
                device.osVersion = ua.toLowerCase().split("version/")[1].split(" ")[0]
            }
        }
        device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);
        if (device.os && device.os === "ios") {
            var osVersionArr = device.osVersion.split(".");
            device.minimalUi = !device.webView && (ipod || iphone) && (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) && $('meta[name="viewport"]').length > 0 && $('meta[name="viewport"]').attr("content").indexOf("minimal-ui") >= 0
        }
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        device.statusBar = false;
        if (device.webView && windowWidth * windowHeight === screen.width * screen.height) {
            device.statusBar = true
        } else {
            device.statusBar = false
        }
        var classNames = [];
        device.pixelRatio = window.devicePixelRatio || 1;
        classNames.push("pixel-ratio-" + Math.floor(device.pixelRatio));
        if (device.pixelRatio >= 2) {
            classNames.push("retina")
        }
        if (device.os) {
            classNames.push(device.os, device.os + "-" + device.osVersion.split(".")[0], device.os + "-" + device.osVersion.replace(/\./g, "-"));
            if (device.os === "ios") {
                var major = parseInt(device.osVersion.split(".")[0], 10);
                for (var i = major - 1; i >= 6; i--) {
                    classNames.push("ios-gt-" + i)
                }
            }
        }
        if (device.statusBar) {
            classNames.push("with-statusbar-overlay")
        } else {
            $("html").removeClass("with-statusbar-overlay")
        }
        if (classNames.length > 0) $("html").addClass(classNames.join(" "));
        $.device = device
    })(Zepto); + function($) {
        "use strict";
        $.compareVersion = function(a, b) {
            var as = a.split(".");
            var bs = b.split(".");
            if (a === b) return 0;
            for (var i = 0; i < as.length; i++) {
                var x = parseInt(as[i]);
                if (!bs[i]) return 1;
                var y = parseInt(bs[i]);
                if (x < y) return -1;
                if (x > y) return 1
            }
            return 1
        }
    }(Zepto); + function($) {
        "use strict";

        function detect(ua, platform) {
            var os = this.os = {},
                browser = this.browser = {},
                webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
                android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
                osx = !!ua.match(/\(Macintosh\; Intel /),
                ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
                ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
                iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
                webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
                win = /Win\d{2}|Windows/.test(platform),
                wp = ua.match(/Windows Phone ([\d.]+)/),
                touchpad = webos && ua.match(/TouchPad/),
                kindle = ua.match(/Kindle\/([\d.]+)/),
                silk = ua.match(/Silk\/([\d._]+)/),
                blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
                bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
                rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
                playbook = ua.match(/PlayBook/),
                chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
                firefox = ua.match(/Firefox\/([\d.]+)/),
                firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
                ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
                webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
                safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);
            if (browser.webkit = !!webkit) browser.version = webkit[1];
            if (android) os.android = true, os.version = android[2];
            if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, ".");
            if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, ".");
            if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, ".") : null;
            if (wp) os.wp = true, os.version = wp[1];
            if (webos) os.webos = true, os.version = webos[2];
            if (touchpad) os.touchpad = true;
            if (blackberry) os.blackberry = true, os.version = blackberry[2];
            if (bb10) os.bb10 = true, os.version = bb10[2];
            if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2];
            if (playbook) browser.playbook = true;
            if (kindle) os.kindle = true, os.version = kindle[1];
            if (silk) browser.silk = true, browser.version = silk[1];
            if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true;
            if (chrome) browser.chrome = true, browser.version = chrome[1];
            if (firefox) browser.firefox = true, browser.version = firefox[1];
            if (firefoxos) os.firefoxos = true, os.version = firefoxos[1];
            if (ie) browser.ie = true, browser.version = ie[1];
            if (safari && (osx || os.ios || win)) {
                browser.safari = true;
                if (!os.ios) browser.version = safari[1]
            }
            if (webview) browser.webview = true;
            os.tablet = !!(ipad || playbook || android && !ua.match(/Mobile/) || firefox && ua.match(/Tablet/) || ie && !ua.match(/Phone/) && ua.match(/Touch/));
            os.phone = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 || chrome && ua.match(/Android/) || chrome && ua.match(/CriOS\/([\d.]+)/) || firefox && ua.match(/Mobile/) || ie && ua.match(/Touch/)))
        }
        detect.call($, navigator.userAgent, navigator.platform);
        $.__detect = detect
    }(Zepto);
    (function($) {
        "use strict";
        ["width", "height"].forEach(function(dimension) {
            var Dimension = dimension.replace(/./, function(m) {
                return m[0].toUpperCase()
            });
            $.fn["outer" + Dimension] = function(margin) {
                var elem = this;
                if (elem) {
                    var size = elem[dimension]();
                    var sides = {
                        width: ["left", "right"],
                        height: ["top", "bottom"]
                    };
                    sides[dimension].forEach(function(side) {
                        if (margin) size += parseInt(elem.css("margin-" + side), 10)
                    });
                    return size
                } else {
                    return null
                }
            }
        });
        $.support = function() {
            var support = {
                touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch)
            };
            return support
        }();
        $.touchEvents = {
            start: $.support.touch ? "touchstart" : "mousedown",
            move: $.support.touch ? "touchmove" : "mousemove",
            end: $.support.touch ? "touchend" : "mouseup"
        };
        $.getTranslate = function(el, axis) {
            var matrix, curTransform, curStyle, transformMatrix;
            if (typeof axis === "undefined") {
                axis = "x"
            }
            curStyle = window.getComputedStyle(el, null);
            if (window.WebKitCSSMatrix) {
                transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === "none" ? "" : curStyle.webkitTransform)
            } else {
                transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
                matrix = transformMatrix.toString().split(",")
            }
            if (axis === "x") {
                if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41;
                else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
                else curTransform = parseFloat(matrix[4])
            }
            if (axis === "y") {
                if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42;
                else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
                else curTransform = parseFloat(matrix[5])
            }
            return curTransform || 0
        };
        $.requestAnimationFrame = function(callback) {
            if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
            else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
            else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
            else {
                return window.setTimeout(callback, 1e3 / 60)
            }
        };
        $.cancelAnimationFrame = function(id) {
            if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
            else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
            else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
            else {
                return window.clearTimeout(id)
            }
        };
        $.fn.transitionEnd = function(callback) {
            var events = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"],
                i, dom = this;

            function fireCallBack(e) {
                if (e.target !== this) return;
                callback.call(this, e);
                for (i = 0; i < events.length; i++) {
                    dom.off(events[i], fireCallBack)
                }
            }
            if (callback) {
                for (i = 0; i < events.length; i++) {
                    dom.on(events[i], fireCallBack)
                }
            }
            return this
        };
        $.fn.dataset = function() {
            var el = this[0];
            if (el) {
                var dataset = {};
                if (el.dataset) {
                    for (var dataKey in el.dataset) {
                        dataset[dataKey] = el.dataset[dataKey]
                    }
                } else {
                    for (var i = 0; i < el.attributes.length; i++) {
                        var attr = el.attributes[i];
                        if (attr.name.indexOf("data-") >= 0) {
                            dataset[$.toCamelCase(attr.name.split("data-")[1])] = attr.value
                        }
                    }
                }
                for (var key in dataset) {
                    if (dataset[key] === "false") dataset[key] = false;
                    else if (dataset[key] === "true") dataset[key] = true;
                    else if (parseFloat(dataset[key]) === dataset[key] * 1) dataset[key] = dataset[key] * 1
                }
                return dataset
            } else return undefined
        };
        $.fn.data = function(key, value) {
            if (typeof key === "undefined") {
                return $(this).dataset()
            }
            if (typeof value === "undefined") {
                if (this[0] && this[0].getAttribute) {
                    var dataKey = this[0].getAttribute("data-" + key);
                    if (dataKey) {
                        return dataKey
                    } else if (this[0].smElementDataStorage && key in this[0].smElementDataStorage) {
                        return this[0].smElementDataStorage[key]
                    } else {
                        return undefined
                    }
                } else return undefined
            } else {
                for (var i = 0; i < this.length; i++) {
                    var el = this[i];
                    if (!el.smElementDataStorage) el.smElementDataStorage = {};
                    el.smElementDataStorage[key] = value
                }
                return this
            }
        };
        $.fn.animationEnd = function(callback) {
            var events = ["webkitAnimationEnd", "OAnimationEnd", "MSAnimationEnd", "animationend"],
                i, dom = this;

            function fireCallBack(e) {
                callback(e);
                for (i = 0; i < events.length; i++) {
                    dom.off(events[i], fireCallBack)
                }
            }
            if (callback) {
                for (i = 0; i < events.length; i++) {
                    dom.on(events[i], fireCallBack)
                }
            }
            return this
        };
        $.fn.transition = function(duration) {
            if (typeof duration !== "string") {
                duration = duration + "ms"
            }
            for (var i = 0; i < this.length; i++) {
                var elStyle = this[i].style;
                elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration
            }
            return this
        };
        $.fn.transform = function(transform) {
            for (var i = 0; i < this.length; i++) {
                var elStyle = this[i].style;
                elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform
            }
            return this
        };
        $.fn.prevAll = function(selector) {
            var prevEls = [];
            var el = this[0];
            if (!el) return $([]);
            while (el.previousElementSibling) {
                var prev = el.previousElementSibling;
                if (selector) {
                    if ($(prev).is(selector)) prevEls.push(prev)
                } else prevEls.push(prev);
                el = prev
            }
            return $(prevEls)
        };
        $.fn.nextAll = function(selector) {
            var nextEls = [];
            var el = this[0];
            if (!el) return $([]);
            while (el.nextElementSibling) {
                var next = el.nextElementSibling;
                if (selector) {
                    if ($(next).is(selector)) nextEls.push(next)
                } else nextEls.push(next);
                el = next
            }
            return $(nextEls)
        };
        $.fn.show = function() {
            var elementDisplay = {};

            function defaultDisplay(nodeName) {
                var element, display;
                if (!elementDisplay[nodeName]) {
                    element = document.createElement(nodeName);
                    document.body.appendChild(element);
                    display = getComputedStyle(element, "").getPropertyValue("display");
                    element.parentNode.removeChild(element);
                    display === "none" && (display = "block");
                    elementDisplay[nodeName] = display
                }
                return elementDisplay[nodeName]
            }
            return this.each(function() {
                this.style.display === "none" && (this.style.display = "");
                if (getComputedStyle(this, "").getPropertyValue("display") === "none");
                this.style.display = defaultDisplay(this.nodeName)
            })
        }
    })(Zepto);
    (function() {
        "use strict";

        function FastClick(layer, options) {
            var oldOnClick;
            options = options || {};
            this.trackingClick = false;
            this.trackingClickStart = 0;
            this.targetElement = null;
            this.touchStartX = 0;
            this.touchStartY = 0;
            this.lastTouchIdentifier = 0;
            this.touchBoundary = options.touchBoundary || 10;
            this.layer = layer;
            this.tapDelay = options.tapDelay || 200;
            this.tapTimeout = options.tapTimeout || 700;
            if (FastClick.notNeeded(layer)) {
                return
            }

            function bind(method, context) {
                return function() {
                    return method.apply(context, arguments)
                }
            }
            var methods = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"];
            var context = this;
            for (var i = 0, l = methods.length; i < l; i++) {
                context[methods[i]] = bind(context[methods[i]], context)
            }
            if (deviceIsAndroid) {
                layer.addEventListener("mouseover", this.onMouse, true);
                layer.addEventListener("mousedown", this.onMouse, true);
                layer.addEventListener("mouseup", this.onMouse, true)
            }
            layer.addEventListener("click", this.onClick, true);
            layer.addEventListener("touchstart", this.onTouchStart, false);
            layer.addEventListener("touchmove", this.onTouchMove, false);
            layer.addEventListener("touchend", this.onTouchEnd, false);
            layer.addEventListener("touchcancel", this.onTouchCancel, false);
            if (!Event.prototype.stopImmediatePropagation) {
                layer.removeEventListener = function(type, callback, capture) {
                    var rmv = Node.prototype.removeEventListener;
                    if (type === "click") {
                        rmv.call(layer, type, callback.hijacked || callback, capture)
                    } else {
                        rmv.call(layer, type, callback, capture)
                    }
                };
                layer.addEventListener = function(type, callback, capture) {
                    var adv = Node.prototype.addEventListener;
                    if (type === "click") {
                        adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
                            if (!event.propagationStopped) {
                                callback(event)
                            }
                        }), capture)
                    } else {
                        adv.call(layer, type, callback, capture)
                    }
                }
            }
            if (typeof layer.onclick === "function") {
                oldOnClick = layer.onclick;
                layer.addEventListener("click", function(event) {
                    oldOnClick(event)
                }, false);
                layer.onclick = null
            }
        }
        var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;
        var deviceIsAndroid = navigator.userAgent.indexOf("Android") > 0 && !deviceIsWindowsPhone;
        var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;
        var deviceIsIOS4 = deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent);
        var deviceIsIOSWithBadTarget = deviceIsIOS && /OS [6-7]_\d/.test(navigator.userAgent);
        var deviceIsBlackBerry10 = navigator.userAgent.indexOf("BB10") > 0;
        var isCompositeLabel = false;
        FastClick.prototype.needsClick = function(target) {
            var parent = target;
            while (parent && parent.tagName.toUpperCase() !== "BODY") {
                if (parent.tagName.toUpperCase() === "LABEL") {
                    isCompositeLabel = true;
                    if (/\bneedsclick\b/.test(parent.className)) return true
                }
                parent = parent.parentNode
            }
            switch (target.nodeName.toLowerCase()) {
                case "button":
                case "select":
                case "textarea":
                    if (target.disabled) {
                        return true
                    }
                    break;
                case "input":
                    if (deviceIsIOS && target.type === "file" || target.disabled) {
                        return true
                    }
                    break;
                case "label":
                case "iframe":
                case "video":
                    return true
            }
            return /\bneedsclick\b/.test(target.className)
        };
        FastClick.prototype.needsFocus = function(target) {
            switch (target.nodeName.toLowerCase()) {
                case "textarea":
                    return true;
                case "select":
                    return !deviceIsAndroid;
                case "input":
                    switch (target.type) {
                        case "button":
                        case "checkbox":
                        case "file":
                        case "image":
                        case "radio":
                        case "submit":
                            return false
                    }
                    return !target.disabled && !target.readOnly;
                default:
                    return /\bneedsfocus\b/.test(target.className)
            }
        };
        FastClick.prototype.sendClick = function(targetElement, event) {
            var clickEvent, touch;
            if (document.activeElement && document.activeElement !== targetElement) {
                document.activeElement.blur()
            }
            touch = event.changedTouches[0];
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
            clickEvent.forwardedTouchEvent = true;
            targetElement.dispatchEvent(clickEvent)
        };
        FastClick.prototype.determineEventType = function(targetElement) {
            if (deviceIsAndroid && targetElement.tagName.toLowerCase() === "select") {
                return "mousedown"
            }
            return "click"
        };
        FastClick.prototype.focus = function(targetElement) {
            var length;
            if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf("date") !== 0 && targetElement.type !== "time" && targetElement.type !== "month") {
                length = targetElement.value.length;
                targetElement.setSelectionRange(length, length)
            } else {
                targetElement.focus()
            }
        };
        FastClick.prototype.updateScrollParent = function(targetElement) {
            var scrollParent, parentElement;
            scrollParent = targetElement.fastClickScrollParent;
            if (!scrollParent || !scrollParent.contains(targetElement)) {
                parentElement = targetElement;
                do {
                    if (parentElement.scrollHeight > parentElement.offsetHeight) {
                        scrollParent = parentElement;
                        targetElement.fastClickScrollParent = parentElement;
                        break
                    }
                    parentElement = parentElement.parentElement
                } while (parentElement)
            }
            if (scrollParent) {
                scrollParent.fastClickLastScrollTop = scrollParent.scrollTop
            }
        };
        FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
            if (eventTarget.nodeType === Node.TEXT_NODE) {
                return eventTarget.parentNode
            }
            return eventTarget
        };
        FastClick.prototype.onTouchStart = function(event) {
            var targetElement, touch, selection;
            if (event.targetTouches.length > 1) {
                return true
            }
            targetElement = this.getTargetElementFromEventTarget(event.target);
            touch = event.targetTouches[0];
            if (deviceIsIOS) {
                selection = window.getSelection();
                if (selection.rangeCount && !selection.isCollapsed) {
                    return true
                }
                if (!deviceIsIOS4) {
                    if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
                        event.preventDefault();
                        return false
                    }
                    this.lastTouchIdentifier = touch.identifier;
                    this.updateScrollParent(targetElement)
                }
            }
            this.trackingClick = true;
            this.trackingClickStart = event.timeStamp;
            this.targetElement = targetElement;
            this.touchStartX = touch.pageX;
            this.touchStartY = touch.pageY;
            if (event.timeStamp - this.lastClickTime < this.tapDelay) {
                event.preventDefault()
            }
            return true
        };
        FastClick.prototype.touchHasMoved = function(event) {
            var touch = event.changedTouches[0],
                boundary = this.touchBoundary;
            if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
                return true
            }
            return false
        };
        FastClick.prototype.onTouchMove = function(event) {
            if (!this.trackingClick) {
                return true
            }
            if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
                this.trackingClick = false;
                this.targetElement = null
            }
            return true
        };
        FastClick.prototype.findControl = function(labelElement) {
            if (labelElement.control !== undefined) {
                return labelElement.control
            }
            if (labelElement.htmlFor) {
                return document.getElementById(labelElement.htmlFor)
            }
            return labelElement.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
        };
        FastClick.prototype.onTouchEnd = function(event) {
            var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;
            if (!this.trackingClick) {
                return true
            }
            if (event.timeStamp - this.lastClickTime < this.tapDelay) {
                this.cancelNextClick = true;
                return true
            }
            if (event.timeStamp - this.trackingClickStart > this.tapTimeout) {
                return true
            }
            this.cancelNextClick = false;
            this.lastClickTime = event.timeStamp;
            trackingClickStart = this.trackingClickStart;
            this.trackingClick = false;
            this.trackingClickStart = 0;
            if (deviceIsIOSWithBadTarget) {
                touch = event.changedTouches[0];
                targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
                targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent
            }
            targetTagName = targetElement.tagName.toLowerCase();
            if (targetTagName === "label") {
                forElement = this.findControl(targetElement);
                if (forElement) {
                    this.focus(targetElement);
                    if (deviceIsAndroid) {
                        return false
                    }
                    targetElement = forElement
                }
            } else if (this.needsFocus(targetElement)) {
                if (event.timeStamp - trackingClickStart > 100 || deviceIsIOS && window.top !== window && targetTagName === "input") {
                    this.targetElement = null;
                    return false
                }
                this.focus(targetElement);
                this.sendClick(targetElement, event);
                if (!deviceIsIOS || targetTagName !== "select") {
                    this.targetElement = null;
                    event.preventDefault()
                }
                return false
            }
            if (deviceIsIOS && !deviceIsIOS4) {
                scrollParent = targetElement.fastClickScrollParent;
                if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
                    return true
                }
            }
            if (!this.needsClick(targetElement)) {
                event.preventDefault();
                this.sendClick(targetElement, event)
            }
            return false
        };
        FastClick.prototype.onTouchCancel = function() {
            this.trackingClick = false;
            this.targetElement = null
        };
        FastClick.prototype.onMouse = function(event) {
            if (!this.targetElement) {
                return true
            }
            if (event.forwardedTouchEvent) {
                return true
            }
            if (!event.cancelable) {
                return true
            }
            if (!this.needsClick(this.targetElement) || this.cancelNextClick) {
                if (event.stopImmediatePropagation) {
                    event.stopImmediatePropagation()
                } else {
                    event.propagationStopped = true
                }
                event.stopPropagation();
                if (!isCompositeLabel) {
                    event.preventDefault()
                }
                return false
            }
            return true
        };
        FastClick.prototype.onClick = function(event) {
            var permitted;
            if (this.trackingClick) {
                this.targetElement = null;
                this.trackingClick = false;
                return true
            }
            if (event.target.type === "submit" && event.detail === 0) {
                return true
            }
            permitted = this.onMouse(event);
            if (!permitted) {
                this.targetElement = null
            }
            return permitted
        };
        FastClick.prototype.destroy = function() {
            var layer = this.layer;
            if (deviceIsAndroid) {
                layer.removeEventListener("mouseover", this.onMouse, true);
                layer.removeEventListener("mousedown", this.onMouse, true);
                layer.removeEventListener("mouseup", this.onMouse, true)
            }
            layer.removeEventListener("click", this.onClick, true);
            layer.removeEventListener("touchstart", this.onTouchStart, false);
            layer.removeEventListener("touchmove", this.onTouchMove, false);
            layer.removeEventListener("touchend", this.onTouchEnd, false);
            layer.removeEventListener("touchcancel", this.onTouchCancel, false)
        };
        FastClick.notNeeded = function(layer) {
            var metaViewport;
            var chromeVersion;
            var blackberryVersion;
            var firefoxVersion;
            if (typeof window.ontouchstart === "undefined") {
                return true
            }
            chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];
            if (chromeVersion) {
                if (deviceIsAndroid) {
                    metaViewport = document.querySelector("meta[name=viewport]");
                    if (metaViewport) {
                        if (metaViewport.content.indexOf("user-scalable=no") !== -1) {
                            return true
                        }
                        if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
                            return true
                        }
                    }
                } else {
                    return true
                }
            }
            if (deviceIsBlackBerry10) {
                blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);
                if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
                    metaViewport = document.querySelector("meta[name=viewport]");
                    if (metaViewport) {
                        if (metaViewport.content.indexOf("user-scalable=no") !== -1) {
                            return true
                        }
                        if (document.documentElement.scrollWidth <= window.outerWidth) {
                            return true
                        }
                    }
                }
            }
            if (layer.style.msTouchAction === "none" || layer.style.touchAction === "manipulation") {
                return true
            }
            firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];
            if (firefoxVersion >= 27) {
                metaViewport = document.querySelector("meta[name=viewport]");
                if (metaViewport && (metaViewport.content.indexOf("user-scalable=no") !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
                    return true
                }
            }
            if (layer.style.touchAction === "none" || layer.style.touchAction === "manipulation") {
                return true
            }
            return false
        };
        FastClick.attach = function(layer, options) {
            return new FastClick(layer, options)
        };
        FastClick.attach(document.body)
    })(); + function($) {
        "use strict";
        $.getCurrentPage = function() {
            return $(".page")[0] || document.body
        }
    }(Zepto); + function($) {
        "use strict";
        var showTab = function(tab, tabLink, force) {
            var newTab = $(tab);
            if (arguments.length === 2) {
                if (typeof tabLink === "boolean") {
                    force = tabLink
                }
            }
            if (newTab.length === 0) return false;
            if (newTab.hasClass("active")) {
                if (force) newTab.trigger("show");
                return false
            }
            var tabs = newTab.parent(".tabs");
            if (tabs.length === 0) return false;
            var oldTab = tabs.children(".tab.active").removeClass("active");
            newTab.addClass("active");
            newTab.trigger("show");
            if (tabLink) tabLink = $(tabLink);
            else {
                if (typeof tab === "string") tabLink = $('.tab-link[href="' + tab + '"]');
                else tabLink = $('.tab-link[href="#' + newTab.attr("id") + '"]');
                if (!tabLink || tabLink && tabLink.length === 0) {
                    $("[data-tab]").each(function() {
                        if (newTab.is($(this).attr("data-tab"))) tabLink = $(this)
                    })
                }
            }
            if (tabLink.length === 0) return;
            var oldTabLink;
            if (oldTab && oldTab.length > 0) {
                var oldTabId = oldTab.attr("id");
                if (oldTabId) oldTabLink = $('.tab-link[href="#' + oldTabId + '"]');
                if (!oldTabLink || oldTabLink && oldTabLink.length === 0) {
                    $("[data-tab]").each(function() {
                        if (oldTab.is($(this).attr("data-tab"))) oldTabLink = $(this)
                    })
                }
            }
            if (tabLink && tabLink.length > 0) tabLink.addClass("active");
            if (oldTabLink && oldTabLink.length > 0) oldTabLink.removeClass("active");
            return true
        };
        var old = $.showTab;
        $.showTab = showTab;
        $.showTab.noConflict = function() {
            $.showTab = old;
            return this
        };
        $(document).on("click", ".tab-link", function(e) {
            e.preventDefault();
            var clicked = $(this);
            showTab(clicked.data("tab") || clicked.attr("href"), clicked)
        })
    }(Zepto); + function($) {
        "use strict";
        var _modalTemplateTempDiv = document.createElement("div");
        $.modalStack = [];
        $.modalStackClearQueue = function() {
            if ($.modalStack.length) {
                $.modalStack.shift()()
            }
        };
        $.modal = function(params) {
            params = params || {};
            var modalHTML = "";
            var buttonsHTML = "";
            if (params.buttons && params.buttons.length > 0) {
                for (var i = 0; i < params.buttons.length; i++) {
                    buttonsHTML += '<span class="modal-button' + (params.buttons[i].bold ? " modal-button-bold" : "") + '">' + params.buttons[i].text + "</span>"
                }
            }
            var titleHTML = params.title ? '<div class="modal-title">' + params.title + "</div>" : "";
            var textHTML = params.text ? '<div class="modal-text">' + params.text + "</div>" : "";
            var afterTextHTML = params.afterText ? params.afterText : "";
            var noButtons = !params.buttons || params.buttons.length === 0 ? "modal-no-buttons" : "";
            var verticalButtons = params.verticalButtons ? "modal-buttons-vertical" : "";
            modalHTML = '<div class="modal ' + noButtons + '"><div class="modal-inner">' + (titleHTML + textHTML + afterTextHTML) + '</div><div class="modal-buttons ' + verticalButtons + '">' + buttonsHTML + "</div></div>";
            _modalTemplateTempDiv.innerHTML = modalHTML;
            var modal = $(_modalTemplateTempDiv).children();
            $(defaults.modalContainer).append(modal[0]);
            modal.find(".modal-button").each(function(index, el) {
                $(el).on("click", function(e) {
                    if (params.buttons[index].close !== false) $.closeModal(modal);
                    if (params.buttons[index].onClick) params.buttons[index].onClick(modal, e);
                    if (params.onClick) params.onClick(modal, index)
                })
            });
            $.openModal(modal);
            return modal[0]
        };
        $.alert = function(text, title, callbackOk) {
            if (typeof title === "function") {
                callbackOk = arguments[1];
                title = undefined
            }
            return $.modal({
                text: text || "",
                title: typeof title === "undefined" ? defaults.modalTitle : title,
                buttons: [{
                    text: defaults.modalButtonOk,
                    bold: true,
                    onClick: callbackOk
                }]
            })
        };
        $.confirm = function(text, title, callbackOk, callbackCancel) {
            if (typeof title === "function") {
                callbackCancel = arguments[2];
                callbackOk = arguments[1];
                title = undefined
            }
            return $.modal({
                text: text || "",
                title: typeof title === "undefined" ? defaults.modalTitle : title,
                buttons: [{
                    text: defaults.modalButtonCancel,
                    onClick: callbackCancel
                }, {
                    text: defaults.modalButtonOk,
                    bold: true,
                    onClick: callbackOk
                }]
            })
        };
        $.prompt = function(text, title, callbackOk, callbackCancel) {
            if (typeof title === "function") {
                callbackCancel = arguments[2];
                callbackOk = arguments[1];
                title = undefined
            }
            return $.modal({
                text: text || "",
                title: typeof title === "undefined" ? defaults.modalTitle : title,
                afterText: '<input type="text" class="modal-text-input">',
                buttons: [{
                    text: defaults.modalButtonCancel
                }, {
                    text: defaults.modalButtonOk,
                    bold: true
                }],
                onClick: function(modal, index) {
                    if (index === 0 && callbackCancel) callbackCancel($(modal).find(".modal-text-input").val());
                    if (index === 1 && callbackOk) callbackOk($(modal).find(".modal-text-input").val())
                }
            })
        };
        $.modalLogin = function(text, title, callbackOk, callbackCancel) {
            if (typeof title === "function") {
                callbackCancel = arguments[2];
                callbackOk = arguments[1];
                title = undefined
            }
            return $.modal({
                text: text || "",
                title: typeof title === "undefined" ? defaults.modalTitle : title,
                afterText: '<input type="text" name="modal-username" placeholder="' + defaults.modalUsernamePlaceholder + '" class="modal-text-input modal-text-input-double"><input type="password" name="modal-password" placeholder="' + defaults.modalPasswordPlaceholder + '" class="modal-text-input modal-text-input-double">',
                buttons: [{
                    text: defaults.modalButtonCancel
                }, {
                    text: defaults.modalButtonOk,
                    bold: true
                }],
                onClick: function(modal, index) {
                    var username = $(modal).find('.modal-text-input[name="modal-username"]').val();
                    var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
                    if (index === 0 && callbackCancel) callbackCancel(username, password);
                    if (index === 1 && callbackOk) callbackOk(username, password)
                }
            })
        };
        $.modalPassword = function(text, title, callbackOk, callbackCancel) {
            if (typeof title === "function") {
                callbackCancel = arguments[2];
                callbackOk = arguments[1];
                title = undefined
            }
            return $.modal({
                text: text || "",
                title: typeof title === "undefined" ? defaults.modalTitle : title,
                afterText: '<input type="password" name="modal-password" placeholder="' + defaults.modalPasswordPlaceholder + '" class="modal-text-input">',
                buttons: [{
                    text: defaults.modalButtonCancel
                }, {
                    text: defaults.modalButtonOk,
                    bold: true
                }],
                onClick: function(modal, index) {
                    var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
                    if (index === 0 && callbackCancel) callbackCancel(password);
                    if (index === 1 && callbackOk) callbackOk(password)
                }
            })
        };
        $.showPreloader = function(title) {
            return $.modal({
                title: title || defaults.modalPreloaderTitle,
                text: '<div class="preloader"></div>'
            })
        };
        $.hidePreloader = function() {
            $.closeModal(".modal.modal-in")
        };
        $.showIndicator = function() {
            $(defaults.modalContainer).append('<div class="preloader-indicator-overlay"></div><div class="preloader-indicator-modal"><span class="preloader preloader-white"></span></div>')
        };
        $.hideIndicator = function() {
            $(".preloader-indicator-overlay, .preloader-indicator-modal").remove()
        };
        $.actions = function(params) {
            var modal, groupSelector, buttonSelector;
            params = params || [];
            if (params.length > 0 && !$.isArray(params[0])) {
                params = [params]
            }
            var modalHTML;
            var buttonsHTML = "";
            for (var i = 0; i < params.length; i++) {
                for (var j = 0; j < params[i].length; j++) {
                    if (j === 0) buttonsHTML += '<div class="actions-modal-group">';
                    var button = params[i][j];
                    var buttonClass = button.label ? "actions-modal-label" : "actions-modal-button";
                    if (button.bold) buttonClass += " actions-modal-button-bold";
                    if (button.color) buttonClass += " color-" + button.color;
                    if (button.bg) buttonClass += " bg-" + button.bg;
                    if (button.disabled) buttonClass += " disabled";
                    buttonsHTML += '<span class="' + buttonClass + '">' + button.text + "</span>";
                    if (j === params[i].length - 1) buttonsHTML += "</div>"
                }
            }
            modalHTML = '<div class="actions-modal">' + buttonsHTML + "</div>";
            _modalTemplateTempDiv.innerHTML = modalHTML;
            modal = $(_modalTemplateTempDiv).children();
            $(defaults.modalContainer).append(modal[0]);
            groupSelector = ".actions-modal-group";
            buttonSelector = ".actions-modal-button";
            var groups = modal.find(groupSelector);
            groups.each(function(index, el) {
                var groupIndex = index;
                $(el).children().each(function(index, el) {
                    var buttonIndex = index;
                    var buttonParams = params[groupIndex][buttonIndex];
                    var clickTarget;
                    if ($(el).is(buttonSelector)) clickTarget = $(el);
                    if (clickTarget) {
                        clickTarget.on("click", function(e) {
                            if (buttonParams.close !== false) $.closeModal(modal);
                            if (buttonParams.onClick) buttonParams.onClick(modal, e)
                        })
                    }
                })
            });
            $.openModal(modal);
            return modal[0]
        };
        $.popup = function(modal, removeOnClose) {
            if (typeof removeOnClose === "undefined") removeOnClose = true;
            if (typeof modal === "string" && modal.indexOf("<") >= 0) {
                var _modal = document.createElement("div");
                _modal.innerHTML = modal.trim();
                if (_modal.childNodes.length > 0) {
                    modal = _modal.childNodes[0];
                    if (removeOnClose) modal.classList.add("remove-on-close");
                    $(defaults.modalContainer).append(modal)
                } else return false
            }
            modal = $(modal);
            if (modal.length === 0) return false;
            modal.show();
            modal.find(".content").scroller("refresh");
            if (modal.find("." + defaults.viewClass).length > 0) {
                $.sizeNavbars(modal.find("." + defaults.viewClass)[0])
            }
            $.openModal(modal);
            return modal[0]
        };
        $.pickerModal = function(pickerModal, removeOnClose) {
            if (typeof removeOnClose === "undefined") removeOnClose = true;
            if (typeof pickerModal === "string" && pickerModal.indexOf("<") >= 0) {
                pickerModal = $(pickerModal);
                if (pickerModal.length > 0) {
                    if (removeOnClose) pickerModal.addClass("remove-on-close");
                    $(defaults.modalContainer).append(pickerModal[0])
                } else return false
            }
            pickerModal = $(pickerModal);
            if (pickerModal.length === 0) return false;
            pickerModal.show();
            $.openModal(pickerModal);
            return pickerModal[0]
        };
        $.loginScreen = function(modal) {
            if (!modal) modal = ".login-screen";
            modal = $(modal);
            if (modal.length === 0) return false;
            modal.show();
            if (modal.find("." + defaults.viewClass).length > 0) {
                $.sizeNavbars(modal.find("." + defaults.viewClass)[0])
            }
            $.openModal(modal);
            return modal[0]
        };
        $.toast = function(msg, duration, extraclass) {
            var $toast = $('<div class="modal toast ' + (extraclass || "") + '">' + msg + "</div>").appendTo(document.body);
            $.openModal($toast, function() {
                setTimeout(function() {
                    $.closeModal($toast)
                }, duration || 2e3)
            })
        };
        $.openModal = function(modal, cb) {
            modal = $(modal);
            var isModal = modal.hasClass("modal");
            if ($(".modal.modal-in:not(.modal-out)").length && defaults.modalStack && isModal) {
                $.modalStack.push(function() {
                    $.openModal(modal, cb)
                });
                return
            }
            var isPopup = modal.hasClass("popup");
            var isLoginScreen = modal.hasClass("login-screen");
            var isPickerModal = modal.hasClass("picker-modal");
            var isToast = modal.hasClass("toast");
            if (isModal) {
                modal.show();
                modal.css({
                    marginTop: -Math.round(modal.outerHeight() / 2) + "px"
                })
            }
            if (isToast) {
                modal.css({
                    marginLeft: -Math.round(modal.outerWidth() / 2 / 1.185) + "px"
                })
            }
            var overlay;
            if (!isLoginScreen && !isPickerModal && !isToast) {
                if ($(".modal-overlay").length === 0 && !isPopup) {
                    $(defaults.modalContainer).append('<div class="modal-overlay"></div>')
                }
                if ($(".popup-overlay").length === 0 && isPopup) {
                    $(defaults.modalContainer).append('<div class="popup-overlay"></div>')
                }
                overlay = isPopup ? $(".popup-overlay") : $(".modal-overlay")
            }
            var clientLeft = modal[0].clientLeft;
            modal.trigger("open");
            if (isPickerModal) {
                $(defaults.modalContainer).addClass("with-picker-modal")
            }
            if (!isLoginScreen && !isPickerModal && !isToast) overlay.addClass("modal-overlay-visible");
            modal.removeClass("modal-out").addClass("modal-in").transitionEnd(function(e) {
                if (modal.hasClass("modal-out")) modal.trigger("closed");
                else modal.trigger("opened")
            });
            if (typeof cb === "function") {
                cb.call(this)
            }
            return true
        };
        $.closeModal = function(modal) {
            modal = $(modal || ".modal-in");
            if (typeof modal !== "undefined" && modal.length === 0) {
                return
            }
            var isModal = modal.hasClass("modal"),
                isPopup = modal.hasClass("popup"),
                isToast = modal.hasClass("toast"),
                isLoginScreen = modal.hasClass("login-screen"),
                isPickerModal = modal.hasClass("picker-modal"),
                removeOnClose = modal.hasClass("remove-on-close"),
                overlay = isPopup ? $(".popup-overlay") : $(".modal-overlay");
            if (isPopup) {
                if (modal.length === $(".popup.modal-in").length) {
                    overlay.removeClass("modal-overlay-visible")
                }
            } else if (!(isPickerModal || isToast)) {
                overlay.removeClass("modal-overlay-visible")
            }
            modal.trigger("close");
            if (isPickerModal) {
                $(defaults.modalContainer).removeClass("with-picker-modal");
                $(defaults.modalContainer).addClass("picker-modal-closing")
            }
            modal.removeClass("modal-in").addClass("modal-out").transitionEnd(function(e) {
                if (modal.hasClass("modal-out")) modal.trigger("closed");
                else modal.trigger("opened");
                if (isPickerModal) {
                    $(defaults.modalContainer).removeClass("picker-modal-closing")
                }
                if (isPopup || isLoginScreen || isPickerModal) {
                    modal.removeClass("modal-out").hide();
                    if (removeOnClose && modal.length > 0) {
                        modal.remove()
                    }
                } else {
                    modal.remove()
                }
            });
            if (isModal && defaults.modalStack) {
                $.modalStackClearQueue()
            }
            return true
        };

        function handleClicks(e) {
            var clicked = $(this);
            var url = clicked.attr("href");
            var clickedData = clicked.dataset();
            var popup;
            if (clicked.hasClass("open-popup")) {
                if (clickedData.popup) {
                    popup = clickedData.popup
                } else popup = ".popup";
                $.popup(popup)
            }
            if (clicked.hasClass("close-popup")) {
                if (clickedData.popup) {
                    popup = clickedData.popup
                } else popup = ".popup.modal-in";
                $.closeModal(popup)
            }
            if (clicked.hasClass("modal-overlay")) {
                if ($(".modal.modal-in").length > 0 && defaults.modalCloseByOutside) $.closeModal(".modal.modal-in");
                if ($(".actions-modal.modal-in").length > 0 && defaults.actionsCloseByOutside) $.closeModal(".actions-modal.modal-in")
            }
            if (clicked.hasClass("popup-overlay")) {
                if ($(".popup.modal-in").length > 0 && defaults.popupCloseByOutside) $.closeModal(".popup.modal-in")
            }
        }
        $(document).on("click", " .modal-overlay, .popup-overlay, .close-popup, .open-popup, .close-picker", handleClicks);
        var defaults = $.modal.prototype.defaults = {
            modalStack: true,
            modalButtonOk: "确定",
            modalButtonCancel: "取消",
            modalPreloaderTitle: "加载中",
            modalContainer: document.body
        }
    }(Zepto); + function($) {
        "use strict";
        var rtl = false;
        var Calendar = function(params) {
            var p = this;
            var defaults = {
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                firstDay: 1,
                weekendDays: [0, 6],
                multiple: false,
                dateFormat: "yyyy-mm-dd",
                direction: "horizontal",
                minDate: null,
                maxDate: null,
                touchMove: true,
                animate: true,
                closeOnSelect: true,
                monthPicker: true,
                monthPickerTemplate: '<div class="picker-calendar-month-picker">' + '<a href="#" class="link icon-only picker-calendar-prev-month"><i class="icon icon-prev"></i></a>' + '<div class="current-month-value"></div>' + '<a href="#" class="link icon-only picker-calendar-next-month"><i class="icon icon-next"></i></a>' + "</div>",
                yearPicker: true,
                yearPickerTemplate: '<div class="picker-calendar-year-picker">' + '<a href="#" class="link icon-only picker-calendar-prev-year"><i class="icon icon-prev"></i></a>' + '<span class="current-year-value"></span>' + '<a href="#" class="link icon-only picker-calendar-next-year"><i class="icon icon-next"></i></a>' + "</div>",
                weekHeader: true,
                scrollToInput: true,
                inputReadOnly: true,
                toolbar: true,
                toolbarCloseText: "Done",
                toolbarTemplate: '<div class="toolbar">' + '<div class="toolbar-inner">' + "{{monthPicker}}" + "{{yearPicker}}" + "</div>" + "</div>"
            };
            params = params || {};
            for (var def in defaults) {
                if (typeof params[def] === "undefined") {
                    params[def] = defaults[def]
                }
            }
            p.params = params;
            p.initialized = false;
            p.inline = p.params.container ? true : false;
            p.isH = p.params.direction === "horizontal";
            var inverter = p.isH ? rtl ? -1 : 1 : 1;
            p.animating = false;

            function formatDate(date) {
                date = new Date(date);
                var year = date.getFullYear();
                var month = date.getMonth();
                var month1 = month + 1;
                var day = date.getDate();
                var weekDay = date.getDay();
                return p.params.dateFormat.replace(/yyyy/g, year).replace(/yy/g, (year + "").substring(2)).replace(/mm/g, month1 < 10 ? "0" + month1 : month1).replace(/m/g, month1).replace(/MM/g, p.params.monthNames[month]).replace(/M/g, p.params.monthNamesShort[month]).replace(/dd/g, day < 10 ? "0" + day : day).replace(/d/g, day).replace(/DD/g, p.params.dayNames[weekDay]).replace(/D/g, p.params.dayNamesShort[weekDay])
            }
            p.addValue = function(value) {
                if (p.params.multiple) {
                    if (!p.value) p.value = [];
                    var inValuesIndex;
                    for (var i = 0; i < p.value.length; i++) {
                        if (new Date(value).getTime() === new Date(p.value[i]).getTime()) {
                            inValuesIndex = i
                        }
                    }
                    if (typeof inValuesIndex === "undefined") {
                        p.value.push(value)
                    } else {
                        p.value.splice(inValuesIndex, 1)
                    }
                    p.updateValue()
                } else {
                    p.value = [value];
                    p.updateValue()
                }
            };
            p.setValue = function(arrValues) {
                p.value = arrValues;
                p.updateValue()
            };
            p.updateValue = function() {
                p.wrapper.find(".picker-calendar-day-selected").removeClass("picker-calendar-day-selected");
                var i, inputValue;
                for (i = 0; i < p.value.length; i++) {
                    var valueDate = new Date(p.value[i]);
                    p.wrapper.find('.picker-calendar-day[data-date="' + valueDate.getFullYear() + "-" + valueDate.getMonth() + "-" + valueDate.getDate() + '"]').addClass("picker-calendar-day-selected")
                }
                if (p.params.onChange) {
                    p.params.onChange(p, p.value, p.value.map(formatDate))
                }
                if (p.input && p.input.length > 0) {
                    if (p.params.formatValue) inputValue = p.params.formatValue(p, p.value);
                    else {
                        inputValue = [];
                        for (i = 0; i < p.value.length; i++) {
                            inputValue.push(formatDate(p.value[i]))
                        }
                        inputValue = inputValue.join(", ")
                    }
                    $(p.input).val(inputValue);
                    $(p.input).trigger("change")
                }
            };
            p.initCalendarEvents = function() {
                var col;
                var allowItemClick = true;
                var isTouched, isMoved, touchStartX, touchStartY, touchCurrentX, touchCurrentY, touchStartTime, touchEndTime, startTranslate, currentTranslate, wrapperWidth, wrapperHeight, percentage, touchesDiff, isScrolling;

                function handleTouchStart(e) {
                    if (isMoved || isTouched) return;
                    isTouched = true;
                    touchStartX = touchCurrentY = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX;
                    touchStartY = touchCurrentY = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY;
                    touchStartTime = (new Date).getTime();
                    percentage = 0;
                    allowItemClick = true;
                    isScrolling = undefined;
                    startTranslate = currentTranslate = p.monthsTranslate
                }

                function handleTouchMove(e) {
                    if (!isTouched) return;
                    touchCurrentX = e.type === "touchmove" ? e.targetTouches[0].pageX : e.pageX;
                    touchCurrentY = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY;
                    if (typeof isScrolling === "undefined") {
                        isScrolling = !!(isScrolling || Math.abs(touchCurrentY - touchStartY) > Math.abs(touchCurrentX - touchStartX))
                    }
                    if (p.isH && isScrolling) {
                        isTouched = false;
                        return
                    }
                    e.preventDefault();
                    if (p.animating) {
                        isTouched = false;
                        return
                    }
                    allowItemClick = false;
                    if (!isMoved) {
                        isMoved = true;
                        wrapperWidth = p.wrapper[0].offsetWidth;
                        wrapperHeight = p.wrapper[0].offsetHeight;
                        p.wrapper.transition(0)
                    }
                    e.preventDefault();
                    touchesDiff = p.isH ? touchCurrentX - touchStartX : touchCurrentY - touchStartY;
                    percentage = touchesDiff / (p.isH ? wrapperWidth : wrapperHeight);
                    currentTranslate = (p.monthsTranslate * inverter + percentage) * 100;
                    p.wrapper.transform("translate3d(" + (p.isH ? currentTranslate : 0) + "%, " + (p.isH ? 0 : currentTranslate) + "%, 0)")
                }

                function handleTouchEnd(e) {
                    if (!isTouched || !isMoved) {
                        isTouched = isMoved = false;
                        return
                    }
                    isTouched = isMoved = false;
                    touchEndTime = (new Date).getTime();
                    if (touchEndTime - touchStartTime < 300) {
                        if (Math.abs(touchesDiff) < 10) {
                            p.resetMonth()
                        } else if (touchesDiff >= 10) {
                            if (rtl) p.nextMonth();
                            else p.prevMonth()
                        } else {
                            if (rtl) p.prevMonth();
                            else p.nextMonth()
                        }
                    } else {
                        if (percentage <= -.5) {
                            if (rtl) p.prevMonth();
                            else p.nextMonth()
                        } else if (percentage >= .5) {
                            if (rtl) p.nextMonth();
                            else p.prevMonth()
                        } else {
                            p.resetMonth()
                        }
                    }
                    setTimeout(function() {
                        allowItemClick = true
                    }, 100)
                }

                function handleDayClick(e) {
                    if (!allowItemClick) return;
                    var day = $(e.target).parents(".picker-calendar-day");
                    if (day.length === 0 && $(e.target).hasClass("picker-calendar-day")) {
                        day = $(e.target)
                    }
                    if (day.length === 0) return;
                    if (day.hasClass("picker-calendar-day-selected") && !p.params.multiple) return;
                    if (day.hasClass("picker-calendar-day-disabled")) return;
                    if (day.hasClass("picker-calendar-day-next")) p.nextMonth();
                    if (day.hasClass("picker-calendar-day-prev")) p.prevMonth();
                    var dateYear = day.attr("data-year");
                    var dateMonth = day.attr("data-month");
                    var dateDay = day.attr("data-day");
                    if (p.params.onDayClick) {
                        p.params.onDayClick(p, day[0], dateYear, dateMonth, dateDay)
                    }
                    p.addValue(new Date(dateYear, dateMonth, dateDay).getTime());
                    if (p.params.closeOnSelect) p.close()
                }
                p.container.find(".picker-calendar-prev-month").on("click", p.prevMonth);
                p.container.find(".picker-calendar-next-month").on("click", p.nextMonth);
                p.container.find(".picker-calendar-prev-year").on("click", p.prevYear);
                p.container.find(".picker-calendar-next-year").on("click", p.nextYear);
                p.wrapper.on("click", handleDayClick);
                if (p.params.touchMove) {
                    p.wrapper.on($.touchEvents.start, handleTouchStart);
                    p.wrapper.on($.touchEvents.move, handleTouchMove);
                    p.wrapper.on($.touchEvents.end, handleTouchEnd)
                }
                p.container[0].f7DestroyCalendarEvents = function() {
                    p.container.find(".picker-calendar-prev-month").off("click", p.prevMonth);
                    p.container.find(".picker-calendar-next-month").off("click", p.nextMonth);
                    p.container.find(".picker-calendar-prev-year").off("click", p.prevYear);
                    p.container.find(".picker-calendar-next-year").off("click", p.nextYear);
                    p.wrapper.off("click", handleDayClick);
                    if (p.params.touchMove) {
                        p.wrapper.off($.touchEvents.start, handleTouchStart);
                        p.wrapper.off($.touchEvents.move, handleTouchMove);
                        p.wrapper.off($.touchEvents.end, handleTouchEnd)
                    }
                }
            };
            p.destroyCalendarEvents = function(colContainer) {
                if ("f7DestroyCalendarEvents" in p.container[0]) p.container[0].f7DestroyCalendarEvents()
            };
            p.daysInMonth = function(date) {
                var d = new Date(date);
                return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
            };
            p.monthHTML = function(date, offset) {
                date = new Date(date);
                var year = date.getFullYear(),
                    month = date.getMonth(),
                    day = date.getDate();
                if (offset === "next") {
                    if (month === 11) date = new Date(year + 1, 0);
                    else date = new Date(year, month + 1, 1)
                }
                if (offset === "prev") {
                    if (month === 0) date = new Date(year - 1, 11);
                    else date = new Date(year, month - 1, 1)
                }
                if (offset === "next" || offset === "prev") {
                    month = date.getMonth();
                    year = date.getFullYear()
                }
                var daysInPrevMonth = p.daysInMonth(new Date(date.getFullYear(), date.getMonth()).getTime() - 10 * 24 * 60 * 60 * 1e3),
                    daysInMonth = p.daysInMonth(date),
                    firstDayOfMonthIndex = new Date(date.getFullYear(), date.getMonth()).getDay();
                if (firstDayOfMonthIndex === 0) firstDayOfMonthIndex = 7;
                var dayDate, currentValues = [],
                    i, j, rows = 6,
                    cols = 7,
                    monthHTML = "",
                    dayIndex = 0 + (p.params.firstDay - 1),
                    today = (new Date).setHours(0, 0, 0, 0),
                    minDate = p.params.minDate ? new Date(p.params.minDate).getTime() : null,
                    maxDate = p.params.maxDate ? new Date(p.params.maxDate).getTime() : null;
                if (p.value && p.value.length) {
                    for (i = 0; i < p.value.length; i++) {
                        currentValues.push(new Date(p.value[i]).setHours(0, 0, 0, 0))
                    }
                }
                for (i = 1; i <= rows; i++) {
                    var rowHTML = "";
                    var row = i;
                    for (j = 1; j <= cols; j++) {
                        var col = j;
                        dayIndex++;
                        var dayNumber = dayIndex - firstDayOfMonthIndex;
                        var addClass = "";
                        if (dayNumber < 0) {
                            dayNumber = daysInPrevMonth + dayNumber + 1;
                            addClass += " picker-calendar-day-prev";
                            dayDate = new Date(month - 1 < 0 ? year - 1 : year, month - 1 < 0 ? 11 : month - 1, dayNumber).getTime()
                        } else {
                            dayNumber = dayNumber + 1;
                            if (dayNumber > daysInMonth) {
                                dayNumber = dayNumber - daysInMonth;
                                addClass += " picker-calendar-day-next";
                                dayDate = new Date(month + 1 > 11 ? year + 1 : year, month + 1 > 11 ? 0 : month + 1, dayNumber).getTime()
                            } else {
                                dayDate = new Date(year, month, dayNumber).getTime()
                            }
                        }
                        if (dayDate === today) addClass += " picker-calendar-day-today";
                        if (currentValues.indexOf(dayDate) >= 0) addClass += " picker-calendar-day-selected";
                        if (p.params.weekendDays.indexOf(col - 1) >= 0) {
                            addClass += " picker-calendar-day-weekend"
                        }
                        if (minDate && dayDate < minDate || maxDate && dayDate > maxDate) {
                            addClass += " picker-calendar-day-disabled"
                        }
                        dayDate = new Date(dayDate);
                        var dayYear = dayDate.getFullYear();
                        var dayMonth = dayDate.getMonth();
                        rowHTML += '<div data-year="' + dayYear + '" data-month="' + dayMonth + '" data-day="' + dayNumber + '" class="picker-calendar-day' + addClass + '" data-date="' + (dayYear + "-" + dayMonth + "-" + dayNumber) + '"><span>' + dayNumber + "</span></div>"
                    }
                    monthHTML += '<div class="picker-calendar-row">' + rowHTML + "</div>"
                }
                monthHTML = '<div class="picker-calendar-month" data-year="' + year + '" data-month="' + month + '">' + monthHTML + "</div>";
                return monthHTML
            };
            p.animating = false;
            p.updateCurrentMonthYear = function(dir) {
                if (typeof dir === "undefined") {
                    p.currentMonth = parseInt(p.months.eq(1).attr("data-month"), 10);
                    p.currentYear = parseInt(p.months.eq(1).attr("data-year"), 10)
                } else {
                    p.currentMonth = parseInt(p.months.eq(dir === "next" ? p.months.length - 1 : 0).attr("data-month"), 10);
                    p.currentYear = parseInt(p.months.eq(dir === "next" ? p.months.length - 1 : 0).attr("data-year"), 10)
                }
                p.container.find(".current-month-value").text(p.params.monthNames[p.currentMonth]);
                p.container.find(".current-year-value").text(p.currentYear)
            };
            p.onMonthChangeStart = function(dir) {
                p.updateCurrentMonthYear(dir);
                p.months.removeClass("picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next");
                var currentIndex = dir === "next" ? p.months.length - 1 : 0;
                p.months.eq(currentIndex).addClass("picker-calendar-month-current");
                p.months.eq(dir === "next" ? currentIndex - 1 : currentIndex + 1).addClass(dir === "next" ? "picker-calendar-month-prev" : "picker-calendar-month-next");
                if (p.params.onMonthYearChangeStart) {
                    p.params.onMonthYearChangeStart(p, p.currentYear, p.currentMonth)
                }
            };
            p.onMonthChangeEnd = function(dir, rebuildBoth) {
                p.animating = false;
                var nextMonthHTML, prevMonthHTML, newMonthHTML;
                p.wrapper.find(".picker-calendar-month:not(.picker-calendar-month-prev):not(.picker-calendar-month-current):not(.picker-calendar-month-next)").remove();
                if (typeof dir === "undefined") {
                    dir = "next";
                    rebuildBoth = true
                }
                if (!rebuildBoth) {
                    newMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), dir)
                } else {
                    p.wrapper.find(".picker-calendar-month-next, .picker-calendar-month-prev").remove();
                    prevMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), "prev");
                    nextMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), "next")
                }
                if (dir === "next" || rebuildBoth) {
                    p.wrapper.append(newMonthHTML || nextMonthHTML)
                }
                if (dir === "prev" || rebuildBoth) {
                    p.wrapper.prepend(newMonthHTML || prevMonthHTML)
                }
                p.months = p.wrapper.find(".picker-calendar-month");
                p.setMonthsTranslate(p.monthsTranslate);
                if (p.params.onMonthAdd) {
                    p.params.onMonthAdd(p, dir === "next" ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0])
                }
                if (p.params.onMonthYearChangeEnd) {
                    p.params.onMonthYearChangeEnd(p, p.currentYear, p.currentMonth)
                }
            };
            p.setMonthsTranslate = function(translate) {
                translate = translate || p.monthsTranslate || 0;
                if (typeof p.monthsTranslate === "undefined") p.monthsTranslate = translate;
                p.months.removeClass("picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next");
                var prevMonthTranslate = -(translate + 1) * 100 * inverter;
                var currentMonthTranslate = -translate * 100 * inverter;
                var nextMonthTranslate = -(translate - 1) * 100 * inverter;
                p.months.eq(0).transform("translate3d(" + (p.isH ? prevMonthTranslate : 0) + "%, " + (p.isH ? 0 : prevMonthTranslate) + "%, 0)").addClass("picker-calendar-month-prev");
                p.months.eq(1).transform("translate3d(" + (p.isH ? currentMonthTranslate : 0) + "%, " + (p.isH ? 0 : currentMonthTranslate) + "%, 0)").addClass("picker-calendar-month-current");
                p.months.eq(2).transform("translate3d(" + (p.isH ? nextMonthTranslate : 0) + "%, " + (p.isH ? 0 : nextMonthTranslate) + "%, 0)").addClass("picker-calendar-month-next")
            };
            p.nextMonth = function(transition) {
                if (typeof transition === "undefined" || typeof transition === "object") {
                    transition = "";
                    if (!p.params.animate) transition = 0
                }
                var nextMonth = parseInt(p.months.eq(p.months.length - 1).attr("data-month"), 10);
                var nextYear = parseInt(p.months.eq(p.months.length - 1).attr("data-year"), 10);
                var nextDate = new Date(nextYear, nextMonth);
                var nextDateTime = nextDate.getTime();
                var transitionEndCallback = p.animating ? false : true;
                if (p.params.maxDate) {
                    if (nextDateTime > new Date(p.params.maxDate).getTime()) {
                        return p.resetMonth()
                    }
                }
                p.monthsTranslate--;
                if (nextMonth === p.currentMonth) {
                    var nextMonthTranslate = -p.monthsTranslate * 100 * inverter;
                    var nextMonthHTML = $(p.monthHTML(nextDateTime, "next")).transform("translate3d(" + (p.isH ? nextMonthTranslate : 0) + "%, " + (p.isH ? 0 : nextMonthTranslate) + "%, 0)").addClass("picker-calendar-month-next");
                    p.wrapper.append(nextMonthHTML[0]);
                    p.months = p.wrapper.find(".picker-calendar-month");
                    if (p.params.onMonthAdd) {
                        p.params.onMonthAdd(p, p.months.eq(p.months.length - 1)[0])
                    }
                }
                p.animating = true;
                p.onMonthChangeStart("next");
                var translate = p.monthsTranslate * 100 * inverter;
                p.wrapper.transition(transition).transform("translate3d(" + (p.isH ? translate : 0) + "%, " + (p.isH ? 0 : translate) + "%, 0)");
                if (transitionEndCallback) {
                    p.wrapper.transitionEnd(function() {
                        p.onMonthChangeEnd("next")
                    })
                }
                if (!p.params.animate) {
                    p.onMonthChangeEnd("next")
                }
            };
            p.prevMonth = function(transition) {
                if (typeof transition === "undefined" || typeof transition === "object") {
                    transition = "";
                    if (!p.params.animate) transition = 0
                }
                var prevMonth = parseInt(p.months.eq(0).attr("data-month"), 10);
                var prevYear = parseInt(p.months.eq(0).attr("data-year"), 10);
                var prevDate = new Date(prevYear, prevMonth + 1, (-1));
                var prevDateTime = prevDate.getTime();
                var transitionEndCallback = p.animating ? false : true;
                if (p.params.minDate) {
                    if (prevDateTime < new Date(p.params.minDate).getTime()) {
                        return p.resetMonth()
                    }
                }
                p.monthsTranslate++;
                if (prevMonth === p.currentMonth) {
                    var prevMonthTranslate = -p.monthsTranslate * 100 * inverter;
                    var prevMonthHTML = $(p.monthHTML(prevDateTime, "prev")).transform("translate3d(" + (p.isH ? prevMonthTranslate : 0) + "%, " + (p.isH ? 0 : prevMonthTranslate) + "%, 0)").addClass("picker-calendar-month-prev");
                    p.wrapper.prepend(prevMonthHTML[0]);
                    p.months = p.wrapper.find(".picker-calendar-month");
                    if (p.params.onMonthAdd) {
                        p.params.onMonthAdd(p, p.months.eq(0)[0])
                    }
                }
                p.animating = true;
                p.onMonthChangeStart("prev");
                var translate = p.monthsTranslate * 100 * inverter;
                p.wrapper.transition(transition).transform("translate3d(" + (p.isH ? translate : 0) + "%, " + (p.isH ? 0 : translate) + "%, 0)");
                if (transitionEndCallback) {
                    p.wrapper.transitionEnd(function() {
                        p.onMonthChangeEnd("prev")
                    })
                }
                if (!p.params.animate) {
                    p.onMonthChangeEnd("prev")
                }
            };
            p.resetMonth = function(transition) {
                if (typeof transition === "undefined") transition = "";
                var translate = p.monthsTranslate * 100 * inverter;
                p.wrapper.transition(transition).transform("translate3d(" + (p.isH ? translate : 0) + "%, " + (p.isH ? 0 : translate) + "%, 0)")
            };
            p.setYearMonth = function(year, month, transition) {
                if (typeof year === "undefined") year = p.currentYear;
                if (typeof month === "undefined") month = p.currentMonth;
                if (typeof transition === "undefined" || typeof transition === "object") {
                    transition = "";
                    if (!p.params.animate) transition = 0
                }
                var targetDate;
                if (year < p.currentYear) {
                    targetDate = new Date(year, month + 1, (-1)).getTime()
                } else {
                    targetDate = new Date(year, month).getTime()
                }
                if (p.params.maxDate && targetDate > new Date(p.params.maxDate).getTime()) {
                    return false
                }
                if (p.params.minDate && targetDate < new Date(p.params.minDate).getTime()) {
                    return false
                }
                var currentDate = new Date(p.currentYear, p.currentMonth).getTime();
                var dir = targetDate > currentDate ? "next" : "prev";
                var newMonthHTML = p.monthHTML(new Date(year, month));
                p.monthsTranslate = p.monthsTranslate || 0;
                var prevTranslate = p.monthsTranslate;
                var monthTranslate, wrapperTranslate;
                var transitionEndCallback = p.animating ? false : true;
                if (targetDate > currentDate) {
                    p.monthsTranslate--;
                    if (!p.animating) p.months.eq(p.months.length - 1).remove();
                    p.wrapper.append(newMonthHTML);
                    p.months = p.wrapper.find(".picker-calendar-month");
                    monthTranslate = -(prevTranslate - 1) * 100 * inverter;
                    p.months.eq(p.months.length - 1).transform("translate3d(" + (p.isH ? monthTranslate : 0) + "%, " + (p.isH ? 0 : monthTranslate) + "%, 0)").addClass("picker-calendar-month-next")
                } else {
                    p.monthsTranslate++;
                    if (!p.animating) p.months.eq(0).remove();
                    p.wrapper.prepend(newMonthHTML);
                    p.months = p.wrapper.find(".picker-calendar-month");
                    monthTranslate = -(prevTranslate + 1) * 100 * inverter;
                    p.months.eq(0).transform("translate3d(" + (p.isH ? monthTranslate : 0) + "%, " + (p.isH ? 0 : monthTranslate) + "%, 0)").addClass("picker-calendar-month-prev")
                }
                if (p.params.onMonthAdd) {
                    p.params.onMonthAdd(p, dir === "next" ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0])
                }
                p.animating = true;
                p.onMonthChangeStart(dir);
                wrapperTranslate = p.monthsTranslate * 100 * inverter;
                p.wrapper.transition(transition).transform("translate3d(" + (p.isH ? wrapperTranslate : 0) + "%, " + (p.isH ? 0 : wrapperTranslate) + "%, 0)");
                if (transitionEndCallback) {
                    p.wrapper.transitionEnd(function() {
                        p.onMonthChangeEnd(dir, true)
                    })
                }
                if (!p.params.animate) {
                    p.onMonthChangeEnd(dir)
                }
            };
            p.nextYear = function() {
                p.setYearMonth(p.currentYear + 1)
            };
            p.prevYear = function() {
                p.setYearMonth(p.currentYear - 1)
            };
            p.layout = function() {
                var pickerHTML = "";
                var pickerClass = "";
                var i;
                var layoutDate = p.value && p.value.length ? p.value[0] : (new Date).setHours(0, 0, 0, 0);
                var prevMonthHTML = p.monthHTML(layoutDate, "prev");
                var currentMonthHTML = p.monthHTML(layoutDate);
                var nextMonthHTML = p.monthHTML(layoutDate, "next");
                var monthsHTML = '<div class="picker-calendar-months"><div class="picker-calendar-months-wrapper">' + (prevMonthHTML + currentMonthHTML + nextMonthHTML) + "</div></div>";
                var weekHeaderHTML = "";
                if (p.params.weekHeader) {
                    for (i = 0; i < 7; i++) {
                        var weekDayIndex = i + p.params.firstDay > 6 ? i - 7 + p.params.firstDay : i + p.params.firstDay;
                        var dayName = p.params.dayNamesShort[weekDayIndex];
                        weekHeaderHTML += '<div class="picker-calendar-week-day ' + (p.params.weekendDays.indexOf(weekDayIndex) >= 0 ? "picker-calendar-week-day-weekend" : "") + '"> ' + dayName + "</div>"
                    }
                    weekHeaderHTML = '<div class="picker-calendar-week-days">' + weekHeaderHTML + "</div>"
                }
                pickerClass = "picker-modal picker-calendar " + (p.params.cssClass || "");
                var toolbarHTML = p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : "";
                if (p.params.toolbar) {
                    toolbarHTML = p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText).replace(/{{monthPicker}}/g, p.params.monthPicker ? p.params.monthPickerTemplate : "").replace(/{{yearPicker}}/g, p.params.yearPicker ? p.params.yearPickerTemplate : "")
                }
                pickerHTML = '<div class="' + pickerClass + '">' + toolbarHTML + '<div class="picker-modal-inner">' + weekHeaderHTML + monthsHTML + "</div>" + "</div>";
                p.pickerHTML = pickerHTML
            };

            function openOnInput(e) {
                e.preventDefault();
                if (p.opened) return;
                p.open();
                if (p.params.scrollToInput) {
                    var pageContent = p.input.parents(".page-content");
                    if (pageContent.length === 0) return;
                    var paddingTop = parseInt(pageContent.css("padding-top"), 10),
                        paddingBottom = parseInt(pageContent.css("padding-bottom"), 10),
                        pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
                        pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
                        newPaddingBottom;
                    var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
                    if (inputTop > pageHeight) {
                        var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
                        if (scrollTop + pageHeight > pageScrollHeight) {
                            newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
                            if (pageHeight === pageScrollHeight) {
                                newPaddingBottom = p.container.height()
                            }
                            pageContent.css({
                                "padding-bottom": newPaddingBottom + "px"
                            })
                        }
                        pageContent.scrollTop(scrollTop, 300)
                    }
                }
            }

            function closeOnHTMLClick(e) {
                if (p.input && p.input.length > 0) {
                    if (e.target !== p.input[0] && $(e.target).parents(".picker-modal").length === 0) p.close()
                } else {
                    if ($(e.target).parents(".picker-modal").length === 0) p.close()
                }
            }
            if (p.params.input) {
                p.input = $(p.params.input);
                if (p.input.length > 0) {
                    if (p.params.inputReadOnly) p.input.prop("readOnly", true);
                    if (!p.inline) {
                        p.input.on("click", openOnInput)
                    }
                    if (p.params.inputReadOnly) {
                        p.input.on("focus mousedown", function(e) {
                            e.preventDefault()
                        })
                    }
                }
            }
            if (!p.inline) $("html").on("click", closeOnHTMLClick);

            function onPickerClose() {
                p.opened = false;
                if (p.input && p.input.length > 0) p.input.parents(".page-content").css({
                    "padding-bottom": ""
                });
                if (p.params.onClose) p.params.onClose(p);
                p.destroyCalendarEvents()
            }
            p.opened = false;
            p.open = function() {
                var updateValue = false;
                if (!p.opened) {
                    if (!p.value) {
                        if (p.params.value) {
                            p.value = p.params.value;
                            updateValue = true
                        }
                    }
                    p.layout();
                    if (p.inline) {
                        p.container = $(p.pickerHTML);
                        p.container.addClass("picker-modal-inline");
                        $(p.params.container).append(p.container)
                    } else {
                        p.container = $($.pickerModal(p.pickerHTML));
                        $(p.container).on("close", function() {
                            onPickerClose()
                        })
                    }
                    p.container[0].f7Calendar = p;
                    p.wrapper = p.container.find(".picker-calendar-months-wrapper");
                    p.months = p.wrapper.find(".picker-calendar-month");
                    p.updateCurrentMonthYear();
                    p.monthsTranslate = 0;
                    p.setMonthsTranslate();
                    p.initCalendarEvents();
                    if (updateValue) p.updateValue()
                }
                p.opened = true;
                p.initialized = true;
                if (p.params.onMonthAdd) {
                    p.months.each(function() {
                        p.params.onMonthAdd(p, this)
                    })
                }
                if (p.params.onOpen) p.params.onOpen(p)
            };
            p.close = function() {
                if (!p.opened || p.inline) return;
                $.closeModal(p.container);
                return
            };
            p.destroy = function() {
                p.close();
                if (p.params.input && p.input.length > 0) {
                    p.input.off("click focus", openOnInput)
                }
                $("html").off("click", closeOnHTMLClick)
            };
            if (p.inline) {
                p.open()
            }
            return p
        };
        $.fn.calendar = function(params) {
            return this.each(function() {
                var $this = $(this);
                if (!$this[0]) return;
                var p = {};
                if ($this[0].tagName.toUpperCase() === "INPUT") {
                    p.input = $this
                } else {
                    p.container = $this
                }
                new Calendar($.extend(p, params))
            })
        };
        $.initCalendar = function(content) {
            var $content = content ? $(content) : $(document.body);
            $content.find("[data-toggle='date']").each(function() {
                $(this).calendar()
            })
        }
    }(Zepto); + function($) {
        "use strict";
        var Picker = function(params) {
            var p = this;
            var defaults = {
                updateValuesOnMomentum: false,
                updateValuesOnTouchmove: true,
                rotateEffect: false,
                momentumRatio: 7,
                freeMode: false,
                scrollToInput: true,
                inputReadOnly: true,
                toolbar: true,
                toolbarCloseText: "确定",
                toolbarTemplate: '<header class="bar bar-nav">          <button class="button button-link pull-right close-picker">确定</button>          <h1 class="title"></h1>          </header>'
            };
            params = params || {};
            for (var def in defaults) {
                if (typeof params[def] === "undefined") {
                    params[def] = defaults[def]
                }
            }
            p.params = params;
            p.cols = [];
            p.initialized = false;
            p.inline = p.params.container ? true : false;
            var originBug = $.device.ios || navigator.userAgent.toLowerCase().indexOf("safari") >= 0 && navigator.userAgent.toLowerCase().indexOf("chrome") < 0 && !$.device.android;
            p.setValue = function(arrValues, transition) {
                var valueIndex = 0;
                for (var i = 0; i < p.cols.length; i++) {
                    if (p.cols[i] && !p.cols[i].divider) {
                        p.cols[i].setValue(arrValues[valueIndex], transition);
                        valueIndex++
                    }
                }
            };
            p.updateValue = function() {
                var newValue = [];
                var newDisplayValue = [];
                for (var i = 0; i < p.cols.length; i++) {
                    if (!p.cols[i].divider) {
                        newValue.push(p.cols[i].value);
                        newDisplayValue.push(p.cols[i].displayValue)
                    }
                }
                if (newValue.indexOf(undefined) >= 0) {
                    return
                }
                p.value = newValue;
                p.displayValue = newDisplayValue;
                if (p.params.onChange) {
                    p.params.onChange(p, p.value, p.displayValue)
                }
                if (p.input && p.input.length > 0) {
                    $(p.input).val(p.params.formatValue ? p.params.formatValue(p, p.value, p.displayValue) : p.value.join(" "));
                    $(p.input).trigger("change")
                }
            };
            p.initPickerCol = function(colElement, updateItems) {
                var colContainer = $(colElement);
                var colIndex = colContainer.index();
                var col = p.cols[colIndex];
                if (col.divider) return;
                col.container = colContainer;
                col.wrapper = col.container.find(".picker-items-col-wrapper");
                col.items = col.wrapper.find(".picker-item");
                var i, j;
                var wrapperHeight, itemHeight, itemsHeight, minTranslate, maxTranslate;
                col.replaceValues = function(values, displayValues) {
                    col.destroyEvents();
                    col.values = values;
                    col.displayValues = displayValues;
                    var newItemsHTML = p.columnHTML(col, true);
                    col.wrapper.html(newItemsHTML);
                    col.items = col.wrapper.find(".picker-item");
                    col.calcSize();
                    col.setValue(col.values[0], 0, true);
                    col.initEvents()
                };
                col.calcSize = function() {
                    if (p.params.rotateEffect) {
                        col.container.removeClass("picker-items-col-absolute");
                        if (!col.width) col.container.css({
                            width: ""
                        })
                    }
                    var colWidth, colHeight;
                    colWidth = 0;
                    colHeight = col.container[0].offsetHeight;
                    wrapperHeight = col.wrapper[0].offsetHeight;
                    itemHeight = col.items[0].offsetHeight;
                    itemsHeight = itemHeight * col.items.length;
                    minTranslate = colHeight / 2 - itemsHeight + itemHeight / 2;
                    maxTranslate = colHeight / 2 - itemHeight / 2;
                    if (col.width) {
                        colWidth = col.width;
                        if (parseInt(colWidth, 10) === colWidth) colWidth = colWidth + "px";
                        col.container.css({
                            width: colWidth
                        })
                    }
                    if (p.params.rotateEffect) {
                        if (!col.width) {
                            col.items.each(function() {
                                var item = $(this);
                                item.css({
                                    width: "auto"
                                });
                                colWidth = Math.max(colWidth, item[0].offsetWidth);
                                item.css({
                                    width: ""
                                })
                            });
                            col.container.css({
                                width: colWidth + 2 + "px"
                            })
                        }
                        col.container.addClass("picker-items-col-absolute")
                    }
                };
                col.calcSize();
                col.wrapper.transform("translate3d(0," + maxTranslate + "px,0)").transition(0);
                var activeIndex = 0;
                var animationFrameId;
                col.setValue = function(newValue, transition, valueCallbacks) {
                    if (typeof transition === "undefined") transition = "";
                    var newActiveIndex = col.wrapper.find('.picker-item[data-picker-value="' + newValue + '"]').index();
                    if (typeof newActiveIndex === "undefined" || newActiveIndex === -1) {
                        return
                    }
                    var newTranslate = -newActiveIndex * itemHeight + maxTranslate;
                    col.wrapper.transition(transition);
                    col.wrapper.transform("translate3d(0," + newTranslate + "px,0)");
                    if (p.params.updateValuesOnMomentum && col.activeIndex && col.activeIndex !== newActiveIndex) {
                        $.cancelAnimationFrame(animationFrameId);
                        col.wrapper.transitionEnd(function() {
                            $.cancelAnimationFrame(animationFrameId)
                        });
                        updateDuringScroll()
                    }
                    col.updateItems(newActiveIndex, newTranslate, transition, valueCallbacks)
                };
                col.updateItems = function(activeIndex, translate, transition, valueCallbacks) {
                    if (typeof translate === "undefined") {
                        translate = $.getTranslate(col.wrapper[0], "y")
                    }
                    if (typeof activeIndex === "undefined") activeIndex = -Math.round((translate - maxTranslate) / itemHeight);
                    if (activeIndex < 0) activeIndex = 0;
                    if (activeIndex >= col.items.length) activeIndex = col.items.length - 1;
                    var previousActiveIndex = col.activeIndex;
                    col.activeIndex = activeIndex;
                    col.wrapper.find(".picker-selected").removeClass("picker-selected");
                    if (p.params.rotateEffect) {
                        col.items.transition(transition)
                    }
                    var selectedItem = col.items.eq(activeIndex).addClass("picker-selected").transform("");
                    if (valueCallbacks || typeof valueCallbacks === "undefined") {
                        col.value = selectedItem.attr("data-picker-value");
                        col.displayValue = col.displayValues ? col.displayValues[activeIndex] : col.value;
                        if (previousActiveIndex !== activeIndex) {
                            if (col.onChange) {
                                col.onChange(p, col.value, col.displayValue)
                            }
                            p.updateValue()
                        }
                    }
                    if (!p.params.rotateEffect) {
                        return
                    }
                    var percentage = (translate - (Math.floor((translate - maxTranslate) / itemHeight) * itemHeight + maxTranslate)) / itemHeight;
                    col.items.each(function() {
                        var item = $(this);
                        var itemOffsetTop = item.index() * itemHeight;
                        var translateOffset = maxTranslate - translate;
                        var itemOffset = itemOffsetTop - translateOffset;
                        var percentage = itemOffset / itemHeight;
                        var itemsFit = Math.ceil(col.height / itemHeight / 2) + 1;
                        var angle = -18 * percentage;
                        if (angle > 180) angle = 180;
                        if (angle < -180) angle = -180;
                        if (Math.abs(percentage) > itemsFit) item.addClass("picker-item-far");
                        else item.removeClass("picker-item-far");
                        item.transform("translate3d(0, " + (-translate + maxTranslate) + "px, " + (originBug ? -110 : 0) + "px) rotateX(" + angle + "deg)")
                    })
                };

                function updateDuringScroll() {
                    animationFrameId = $.requestAnimationFrame(function() {
                        col.updateItems(undefined, undefined, 0);
                        updateDuringScroll()
                    })
                }
                if (updateItems) col.updateItems(0, maxTranslate, 0);
                var allowItemClick = true;
                var isTouched, isMoved, touchStartY, touchCurrentY, touchStartTime, touchEndTime, startTranslate, returnTo, currentTranslate, prevTranslate, velocityTranslate, velocityTime;

                function handleTouchStart(e) {
                    if (isMoved || isTouched) return;
                    e.preventDefault();
                    isTouched = true;
                    touchStartY = touchCurrentY = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY;
                    touchStartTime = (new Date).getTime();
                    allowItemClick = true;
                    startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], "y")
                }

                function handleTouchMove(e) {
                    if (!isTouched) return;
                    e.preventDefault();
                    allowItemClick = false;
                    touchCurrentY = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY;
                    if (!isMoved) {
                        $.cancelAnimationFrame(animationFrameId);
                        isMoved = true;
                        startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], "y");
                        col.wrapper.transition(0)
                    }
                    e.preventDefault();
                    var diff = touchCurrentY - touchStartY;
                    currentTranslate = startTranslate + diff;
                    returnTo = undefined;
                    if (currentTranslate < minTranslate) {
                        currentTranslate = minTranslate - Math.pow(minTranslate - currentTranslate, .8);
                        returnTo = "min"
                    }
                    if (currentTranslate > maxTranslate) {
                        currentTranslate = maxTranslate + Math.pow(currentTranslate - maxTranslate, .8);
                        returnTo = "max"
                    }
                    col.wrapper.transform("translate3d(0," + currentTranslate + "px,0)");
                    col.updateItems(undefined, currentTranslate, 0, p.params.updateValuesOnTouchmove);
                    velocityTranslate = currentTranslate - prevTranslate || currentTranslate;
                    velocityTime = (new Date).getTime();
                    prevTranslate = currentTranslate
                }

                function handleTouchEnd(e) {
                    if (!isTouched || !isMoved) {
                        isTouched = isMoved = false;
                        return
                    }
                    isTouched = isMoved = false;
                    col.wrapper.transition("");
                    if (returnTo) {
                        if (returnTo === "min") {
                            col.wrapper.transform("translate3d(0," + minTranslate + "px,0)")
                        } else col.wrapper.transform("translate3d(0," + maxTranslate + "px,0)")
                    }
                    touchEndTime = (new Date).getTime();
                    var velocity, newTranslate;
                    if (touchEndTime - touchStartTime > 300) {
                        newTranslate = currentTranslate
                    } else {
                        velocity = Math.abs(velocityTranslate / (touchEndTime - velocityTime));
                        newTranslate = currentTranslate + velocityTranslate * p.params.momentumRatio
                    }
                    newTranslate = Math.max(Math.min(newTranslate, maxTranslate), minTranslate);
                    var activeIndex = -Math.floor((newTranslate - maxTranslate) / itemHeight);
                    if (!p.params.freeMode) newTranslate = -activeIndex * itemHeight + maxTranslate;
                    col.wrapper.transform("translate3d(0," + parseInt(newTranslate, 10) + "px,0)");
                    col.updateItems(activeIndex, newTranslate, "", true);
                    if (p.params.updateValuesOnMomentum) {
                        updateDuringScroll();
                        col.wrapper.transitionEnd(function() {
                            $.cancelAnimationFrame(animationFrameId)
                        })
                    }
                    setTimeout(function() {
                        allowItemClick = true
                    }, 100)
                }

                function handleClick(e) {
                    if (!allowItemClick) return;
                    $.cancelAnimationFrame(animationFrameId);
                    var value = $(this).attr("data-picker-value");
                    col.setValue(value)
                }
                col.initEvents = function(detach) {
                    var method = detach ? "off" : "on";
                    col.container[method]($.touchEvents.start, handleTouchStart);
                    col.container[method]($.touchEvents.move, handleTouchMove);
                    col.container[method]($.touchEvents.end, handleTouchEnd);
                    col.items[method]("click", handleClick)
                };
                col.destroyEvents = function() {
                    col.initEvents(true)
                };
                col.container[0].f7DestroyPickerCol = function() {
                    col.destroyEvents()
                };
                col.initEvents()
            };
            p.destroyPickerCol = function(colContainer) {
                colContainer = $(colContainer);
                if ("f7DestroyPickerCol" in colContainer[0]) colContainer[0].f7DestroyPickerCol()
            };

            function resizeCols() {
                if (!p.opened) return;
                for (var i = 0; i < p.cols.length; i++) {
                    if (!p.cols[i].divider) {
                        p.cols[i].calcSize();
                        p.cols[i].setValue(p.cols[i].value, 0, false)
                    }
                }
            }
            $(window).on("resize", resizeCols);
            p.columnHTML = function(col, onlyItems) {
                var columnItemsHTML = "";
                var columnHTML = "";
                if (col.divider) {
                    columnHTML += '<div class="picker-items-col picker-items-col-divider ' + (col.textAlign ? "picker-items-col-" + col.textAlign : "") + " " + (col.cssClass || "") + '">' + col.content + "</div>"
                } else {
                    for (var j = 0; j < col.values.length; j++) {
                        columnItemsHTML += '<div class="picker-item" data-picker-value="' + col.values[j] + '">' + (col.displayValues ? col.displayValues[j] : col.values[j]) + "</div>"
                    }
                    columnHTML += '<div class="picker-items-col ' + (col.textAlign ? "picker-items-col-" + col.textAlign : "") + " " + (col.cssClass || "") + '"><div class="picker-items-col-wrapper">' + columnItemsHTML + "</div></div>"
                }
                return onlyItems ? columnItemsHTML : columnHTML
            };
            p.layout = function() {
                var pickerHTML = "";
                var pickerClass = "";
                var i;
                p.cols = [];
                var colsHTML = "";
                for (i = 0; i < p.params.cols.length; i++) {
                    var col = p.params.cols[i];
                    colsHTML += p.columnHTML(p.params.cols[i]);
                    p.cols.push(col)
                }
                pickerClass = "picker-modal picker-columns " + (p.params.cssClass || "") + (p.params.rotateEffect ? " picker-3d" : "");
                pickerHTML = '<div class="' + pickerClass + '">' + (p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : "") + '<div class="picker-modal-inner picker-items">' + colsHTML + '<div class="picker-center-highlight"></div>' + "</div>" + "</div>";
                p.pickerHTML = pickerHTML
            };

            function openOnInput(e) {
                e.preventDefault();
                if (p.opened) return;
                p.open();
                if (p.params.scrollToInput) {
                    var pageContent = p.input.parents(".page-content");
                    if (pageContent.length === 0) return;
                    var paddingTop = parseInt(pageContent.css("padding-top"), 10),
                        paddingBottom = parseInt(pageContent.css("padding-bottom"), 10),
                        pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
                        pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
                        newPaddingBottom;
                    var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
                    if (inputTop > pageHeight) {
                        var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
                        if (scrollTop + pageHeight > pageScrollHeight) {
                            newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
                            if (pageHeight === pageScrollHeight) {
                                newPaddingBottom = p.container.height()
                            }
                            pageContent.css({
                                "padding-bottom": newPaddingBottom + "px"
                            })
                        }
                        pageContent.scrollTop(scrollTop, 300)
                    }
                }
            }

            function closeOnHTMLClick(e) {
                if (p.input && p.input.length > 0) {
                    if (e.target !== p.input[0] && $(e.target).parents(".picker-modal").length === 0) p.close()
                } else {
                    if ($(e.target).parents(".picker-modal").length === 0) p.close()
                }
            }
            if (p.params.input) {
                p.input = $(p.params.input);
                if (p.input.length > 0) {
                    if (p.params.inputReadOnly) p.input.prop("readOnly", true);
                    if (!p.inline) {
                        p.input.on("click", openOnInput)
                    }
                    if (p.params.inputReadOnly) {
                        p.input.on("focus mousedown", function(e) {
                            e.preventDefault()
                        })
                    }
                }
            }
            if (!p.inline) $("html").on("click", closeOnHTMLClick);

            function onPickerClose() {
                p.opened = false;
                if (p.input && p.input.length > 0) p.input.parents(".page-content").css({
                    "padding-bottom": ""
                });
                if (p.params.onClose) p.params.onClose(p);
                p.container.find(".picker-items-col").each(function() {
                    p.destroyPickerCol(this)
                })
            }
            p.opened = false;
            p.open = function() {
                if (!p.opened) {
                    p.layout();
                    if (p.inline) {
                        p.container = $(p.pickerHTML);
                        p.container.addClass("picker-modal-inline");
                        $(p.params.container).append(p.container)
                    } else {
                        p.container = $($.pickerModal(p.pickerHTML));
                        $(p.container).on("close", function() {
                            onPickerClose()
                        })
                    }
                    p.container[0].f7Picker = p;
                    p.container.find(".picker-items-col").each(function() {
                        var updateItems = true;
                        if (!p.initialized && p.params.value || p.initialized && p.value) updateItems = false;
                        p.initPickerCol(this, updateItems)
                    });
                    if (!p.initialized) {
                        if (p.params.value) {
                            p.setValue(p.params.value, 0)
                        }
                    } else {
                        if (p.value) p.setValue(p.value, 0)
                    }
                }
                p.opened = true;
                p.initialized = true;
                if (p.params.onOpen) p.params.onOpen(p)
            };
            p.close = function() {
                if (!p.opened || p.inline) return;
                $.closeModal(p.container);
                return
            };
            p.destroy = function() {
                p.close();
                if (p.params.input && p.input.length > 0) {
                    p.input.off("click focus", openOnInput)
                }
                $("html").off("click", closeOnHTMLClick);
                $(window).off("resize", resizeCols)
            };
            if (p.inline) {
                p.open()
            }
            return p
        };
        $(document).on("click", ".close-picker", function() {
            var pickerToClose = $(".picker-modal.modal-in");
            $.closeModal(pickerToClose)
        });
        $.fn.picker = function(params) {
            var args = arguments;
            return this.each(function() {
                if (!this) return;
                var $this = $(this);
                var picker = $this.data("picker");
                if (!picker) {
                    var p = $.extend({
                        input: this
                    }, params);
                    picker = new Picker(p);
                    $this.data("picker", picker)
                }
                if (typeof params === typeof "a") {
                    picker[params].apply(picker, Array.prototype.slice.call(args, 1))
                }
            })
        }
    }(Zepto); + function($) {
        "use strict";
        var today = new Date;
        var getDays = function(max) {
            var days = [];
            for (var i = 1; i <= (max || 31); i++) {
                days.push(i < 10 ? "0" + i : i)
            }
            return days
        };
        var getDaysByMonthAndYear = function(month, year) {
            var int_d = new Date(year, parseInt(month) + 1 - 1, 1);
            var d = new Date(int_d - 1);
            return getDays(d.getDate())
        };
        var formatNumber = function(n) {
            return n < 10 ? "0" + n : n
        };
        var initMonthes = "01 02 03 04 05 06 07 08 09 10 11 12".split(" ");
        var initYears = function() {
            var arr = [];
            for (var i = 1950; i <= 2030; i++) {
                arr.push(i)
            }
            return arr
        }();
        var defaults = {
            rotateEffect: false,
            value: [today.getFullYear(), formatNumber(today.getMonth() + 1), today.getDate(), today.getHours(), formatNumber(today.getMinutes())],
            onChange: function(picker, values, displayValues) {
                var days = getDaysByMonthAndYear(picker.cols[1].value, picker.cols[0].value);
                var currentValue = picker.cols[2].value;
                if (currentValue > days.length) currentValue = days.length;
                picker.cols[2].setValue(currentValue)
            },
            formatValue: function(p, values, displayValues) {
                return displayValues[0] + "-" + values[1] + "-" + values[2] + " " + values[3] + ":" + values[4]
            },
            cols: [{
                values: initYears
            }, {
                values: initMonthes
            }, {
                values: getDays()
            }, {
                divider: true,
                content: "  "
            }, {
                values: function() {
                    var arr = [];
                    for (var i = 0; i <= 23; i++) {
                        arr.push(i)
                    }
                    return arr
                }()
            }, {
                divider: true,
                content: ":"
            }, {
                values: function() {
                    var arr = [];
                    for (var i = 0; i <= 59; i++) {
                        arr.push(i < 10 ? "0" + i : i)
                    }
                    return arr
                }()
            }]
        };
        $.fn.datetimePicker = function(params) {
            return this.each(function() {
                if (!this) return;
                var p = $.extend(defaults, params);
                $(this).picker(p)
            })
        }
    }(Zepto); + function(window) {
        "use strict";
        var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1e3 / 60)
        };
        var utils = function() {
            var me = {};
            var _elementStyle = document.createElement("div").style;
            var _vendor = function() {
                var vendors = ["t", "webkitT", "MozT", "msT", "OT"],
                    transform, i = 0,
                    l = vendors.length;
                for (; i < l; i++) {
                    transform = vendors[i] + "ransform";
                    if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1)
                }
                return false
            }();

            function _prefixStyle(style) {
                if (_vendor === false) return false;
                if (_vendor === "") return style;
                return _vendor + style.charAt(0).toUpperCase() + style.substr(1)
            }
            me.getTime = Date.now || function getTime() {
                return (new Date).getTime()
            };
            me.extend = function(target, obj) {
                for (var i in obj) {
                    target[i] = obj[i]
                }
            };
            me.addEvent = function(el, type, fn, capture) {
                el.addEventListener(type, fn, !!capture)
            };
            me.removeEvent = function(el, type, fn, capture) {
                el.removeEventListener(type, fn, !!capture)
            };
            me.prefixPointerEvent = function(pointerEvent) {
                return window.MSPointerEvent ? "MSPointer" + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10) : pointerEvent
            };
            me.momentum = function(current, start, time, lowerMargin, wrapperSize, deceleration, self) {
                var distance = current - start,
                    speed = Math.abs(distance) / time,
                    destination, duration;
                speed = speed / 2;
                speed = speed > 1.5 ? 1.5 : speed;
                deceleration = deceleration === undefined ? 6e-4 : deceleration;
                destination = current + speed * speed / (2 * deceleration) * (distance < 0 ? -1 : 1);
                duration = speed / deceleration;
                if (destination < lowerMargin) {
                    destination = wrapperSize ? lowerMargin - wrapperSize / 2.5 * (speed / 8) : lowerMargin;
                    distance = Math.abs(destination - current);
                    duration = distance / speed
                } else if (destination > 0) {
                    destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
                    distance = Math.abs(current) + destination;
                    duration = distance / speed
                }
                var t = +new Date;
                var l = t;

                function eventTrigger() {
                    if (+new Date - l > 50) {
                        self._execEvent("scroll");
                        l = +new Date
                    }
                    if (+new Date - t < duration) {
                        rAF(eventTrigger)
                    }
                }
                rAF(eventTrigger);
                return {
                    destination: Math.round(destination),
                    duration: duration
                }
            };
            var _transform = _prefixStyle("transform");
            me.extend(me, {
                hasTransform: _transform !== false,
                hasPerspective: _prefixStyle("perspective") in _elementStyle,
                hasTouch: "ontouchstart" in window,
                hasPointer: window.PointerEvent || window.MSPointerEvent,
                hasTransition: _prefixStyle("transition") in _elementStyle
            });
            me.isBadAndroid = /Android /.test(window.navigator.appVersion) && !/Chrome\/\d/.test(window.navigator.appVersion) && false;
            me.extend(me.style = {}, {
                transform: _transform,
                transitionTimingFunction: _prefixStyle("transitionTimingFunction"),
                transitionDuration: _prefixStyle("transitionDuration"),
                transitionDelay: _prefixStyle("transitionDelay"),
                transformOrigin: _prefixStyle("transformOrigin")
            });
            me.hasClass = function(e, c) {
                var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
                return re.test(e.className)
            };
            me.addClass = function(e, c) {
                if (me.hasClass(e, c)) {
                    return
                }
                var newclass = e.className.split(" ");
                newclass.push(c);
                e.className = newclass.join(" ")
            };
            me.removeClass = function(e, c) {
                if (!me.hasClass(e, c)) {
                    return
                }
                var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
                e.className = e.className.replace(re, " ")
            };
            me.offset = function(el) {
                var left = -el.offsetLeft,
                    top = -el.offsetTop;
                while (el = el.offsetParent) {
                    left -= el.offsetLeft;
                    top -= el.offsetTop
                }
                return {
                    left: left,
                    top: top
                }
            };
            me.preventDefaultException = function(el, exceptions) {
                for (var i in exceptions) {
                    if (exceptions[i].test(el[i])) {
                        return true
                    }
                }
                return false
            };
            me.extend(me.eventType = {}, {
                touchstart: 1,
                touchmove: 1,
                touchend: 1,
                mousedown: 2,
                mousemove: 2,
                mouseup: 2,
                pointerdown: 3,
                pointermove: 3,
                pointerup: 3,
                MSPointerDown: 3,
                MSPointerMove: 3,
                MSPointerUp: 3
            });
            me.extend(me.ease = {}, {
                quadratic: {
                    style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    fn: function(k) {
                        return k * (2 - k)
                    }
                },
                circular: {
                    style: "cubic-bezier(0.1, 0.57, 0.1, 1)",
                    fn: function(k) {
                        return Math.sqrt(1 - --k * k)
                    }
                },
                back: {
                    style: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    fn: function(k) {
                        var b = 4;
                        return (k = k - 1) * k * ((b + 1) * k + b) + 1
                    }
                },
                bounce: {
                    style: "",
                    fn: function(k) {
                        if ((k /= 1) < 1 / 2.75) {
                            return 7.5625 * k * k
                        } else if (k < 2 / 2.75) {
                            return 7.5625 * (k -= 1.5 / 2.75) * k + .75
                        } else if (k < 2.5 / 2.75) {
                            return 7.5625 * (k -= 2.25 / 2.75) * k + .9375
                        } else {
                            return 7.5625 * (k -= 2.625 / 2.75) * k + .984375
                        }
                    }
                },
                elastic: {
                    style: "",
                    fn: function(k) {
                        var f = .22,
                            e = .4;
                        if (k === 0) {
                            return 0
                        }
                        if (k === 1) {
                            return 1
                        }
                        return e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1
                    }
                }
            });
            me.tap = function(e, eventName) {
                var ev = document.createEvent("Event");
                ev.initEvent(eventName, true, true);
                ev.pageX = e.pageX;
                ev.pageY = e.pageY;
                e.target.dispatchEvent(ev)
            };
            me.click = function(e) {
                var target = e.target,
                    ev;
                if (!/(SELECT|INPUT|TEXTAREA)/i.test(target.tagName)) {
                    ev = document.createEvent("MouseEvents");
                    ev.initMouseEvent("click", true, true, e.view, 1, target.screenX, target.screenY, target.clientX, target.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null);
                    ev._constructed = true;
                    target.dispatchEvent(ev)
                }
            };
            return me
        }();

        function IScroll(el, options) {
            this.wrapper = typeof el === "string" ? document.querySelector(el) : el;
            this.scroller = $(this.wrapper).find(".content-inner")[0];
            this.scrollerStyle = this.scroller && this.scroller.style;
            this.options = {
                resizeScrollbars: true,
                mouseWheelSpeed: 20,
                snapThreshold: .334,
                startX: 0,
                startY: 0,
                scrollY: true,
                directionLockThreshold: 5,
                momentum: true,
                bounce: true,
                bounceTime: 600,
                bounceEasing: "",
                preventDefault: true,
                preventDefaultException: {
                    tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
                },
                HWCompositing: true,
                useTransition: true,
                useTransform: true,
                eventPassthrough: undefined
            };
            for (var i in options) {
                this.options[i] = options[i]
            }
            this.translateZ = this.options.HWCompositing && utils.hasPerspective ? " translateZ(0)" : "";
            this.options.useTransition = utils.hasTransition && this.options.useTransition;
            this.options.useTransform = utils.hasTransform && this.options.useTransform;
            this.options.eventPassthrough = this.options.eventPassthrough === true ? "vertical" : this.options.eventPassthrough;
            this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;
            this.options.scrollY = this.options.eventPassthrough === "vertical" ? false : this.options.scrollY;
            this.options.scrollX = this.options.eventPassthrough === "horizontal" ? false : this.options.scrollX;
            this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
            this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;
            this.options.bounceEasing = typeof this.options.bounceEasing === "string" ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;
            this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;
            if (this.options.tap === true) {
                this.options.tap = "tap"
            }
            if (this.options.shrinkScrollbars === "scale") {
                this.options.useTransition = false
            }
            this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;
            if (this.options.probeType === 3) {
                this.options.useTransition = false
            }
            this.x = 0;
            this.y = 0;
            this.directionX = 0;
            this.directionY = 0;
            this._events = {};
            this._init();
            this.refresh();
            this.scrollTo(this.options.startX, this.options.startY);
            this.enable()
        }
        IScroll.prototype = {
            version: "5.1.3",
            _init: function() {
                this._initEvents();
                if (this.options.scrollbars || this.options.indicators) {
                    this._initIndicators()
                }
                if (this.options.mouseWheel) {
                    this._initWheel()
                }
                if (this.options.snap) {
                    this._initSnap()
                }
                if (this.options.keyBindings) {
                    this._initKeys()
                }
            },
            destroy: function() {
                this._initEvents(true);
                this._execEvent("destroy")
            },
            _transitionEnd: function(e) {
                if (e.target !== this.scroller || !this.isInTransition) {
                    return
                }
                this._transitionTime();
                if (!this.resetPosition(this.options.bounceTime)) {
                    this.isInTransition = false;
                    this._execEvent("scrollEnd")
                }
            },
            _start: function(e) {
                if (utils.eventType[e.type] !== 1) {
                    if (e.button !== 0) {
                        return
                    }
                }
                if (!this.enabled || this.initiated && utils.eventType[e.type] !== this.initiated) {
                    return
                }
                if (this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                    e.preventDefault()
                }
                var point = e.touches ? e.touches[0] : e,
                    pos;
                this.initiated = utils.eventType[e.type];
                this.moved = false;
                this.distX = 0;
                this.distY = 0;
                this.directionX = 0;
                this.directionY = 0;
                this.directionLocked = 0;
                this._transitionTime();
                this.startTime = utils.getTime();
                if (this.options.useTransition && this.isInTransition) {
                    this.isInTransition = false;
                    pos = this.getComputedPosition();
                    this._translate(Math.round(pos.x), Math.round(pos.y));
                    this._execEvent("scrollEnd")
                } else if (!this.options.useTransition && this.isAnimating) {
                    this.isAnimating = false;
                    this._execEvent("scrollEnd")
                }
                this.startX = this.x;
                this.startY = this.y;
                this.absStartX = this.x;
                this.absStartY = this.y;
                this.pointX = point.pageX;
                this.pointY = point.pageY;
                this._execEvent("beforeScrollStart")
            },
            _move: function(e) {
                if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                    return
                }
                if (this.options.preventDefault) {
                    e.preventDefault()
                }
                var point = e.touches ? e.touches[0] : e,
                    deltaX = point.pageX - this.pointX,
                    deltaY = point.pageY - this.pointY,
                    timestamp = utils.getTime(),
                    newX, newY, absDistX, absDistY;
                this.pointX = point.pageX;
                this.pointY = point.pageY;
                this.distX += deltaX;
                this.distY += deltaY;
                absDistX = Math.abs(this.distX);
                absDistY = Math.abs(this.distY);
                if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
                    return
                }
                if (!this.directionLocked && !this.options.freeScroll) {
                    if (absDistX > absDistY + this.options.directionLockThreshold) {
                        this.directionLocked = "h"
                    } else if (absDistY >= absDistX + this.options.directionLockThreshold) {
                        this.directionLocked = "v"
                    } else {
                        this.directionLocked = "n"
                    }
                }
                if (this.directionLocked === "h") {
                    if (this.options.eventPassthrough === "vertical") {
                        e.preventDefault()
                    } else if (this.options.eventPassthrough === "horizontal") {
                        this.initiated = false;
                        return
                    }
                    deltaY = 0
                } else if (this.directionLocked === "v") {
                    if (this.options.eventPassthrough === "horizontal") {
                        e.preventDefault()
                    } else if (this.options.eventPassthrough === "vertical") {
                        this.initiated = false;
                        return
                    }
                    deltaX = 0
                }
                deltaX = this.hasHorizontalScroll ? deltaX : 0;
                deltaY = this.hasVerticalScroll ? deltaY : 0;
                newX = this.x + deltaX;
                newY = this.y + deltaY;
                if (newX > 0 || newX < this.maxScrollX) {
                    newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX
                }
                if (newY > 0 || newY < this.maxScrollY) {
                    newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY
                }
                this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
                this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;
                if (!this.moved) {
                    this._execEvent("scrollStart")
                }
                this.moved = true;
                this._translate(newX, newY);
                if (timestamp - this.startTime > 300) {
                    this.startTime = timestamp;
                    this.startX = this.x;
                    this.startY = this.y;
                    if (this.options.probeType === 1) {
                        this._execEvent("scroll")
                    }
                }
                if (this.options.probeType > 1) {
                    this._execEvent("scroll")
                }
            },
            _end: function(e) {
                if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                    return
                }
                if (this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                    e.preventDefault()
                }
                var momentumX, momentumY, duration = utils.getTime() - this.startTime,
                    newX = Math.round(this.x),
                    newY = Math.round(this.y),
                    distanceX = Math.abs(newX - this.startX),
                    distanceY = Math.abs(newY - this.startY),
                    time = 0,
                    easing = "";
                this.isInTransition = 0;
                this.initiated = 0;
                this.endTime = utils.getTime();
                if (this.resetPosition(this.options.bounceTime)) {
                    return
                }
                this.scrollTo(newX, newY);
                if (!this.moved) {
                    if (this.options.tap) {
                        utils.tap(e, this.options.tap)
                    }
                    if (this.options.click) {
                        utils.click(e)
                    }
                    this._execEvent("scrollCancel");
                    return
                }
                if (this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100) {
                    this._execEvent("flick");
                    return
                }
                if (this.options.momentum && duration < 300) {
                    momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration, this) : {
                        destination: newX,
                        duration: 0
                    };
                    momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration, this) : {
                        destination: newY,
                        duration: 0
                    };
                    newX = momentumX.destination;
                    newY = momentumY.destination;
                    time = Math.max(momentumX.duration, momentumY.duration);
                    this.isInTransition = 1
                }
                if (this.options.snap) {
                    var snap = this._nearestSnap(newX, newY);
                    this.currentPage = snap;
                    time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(newX - snap.x), 1e3), Math.min(Math.abs(newY - snap.y), 1e3)), 300);
                    newX = snap.x;
                    newY = snap.y;
                    this.directionX = 0;
                    this.directionY = 0;
                    easing = this.options.bounceEasing
                }
                if (newX !== this.x || newY !== this.y) {
                    if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
                        easing = utils.ease.quadratic
                    }
                    this.scrollTo(newX, newY, time, easing);
                    return
                }
                this._execEvent("scrollEnd")
            },
            _resize: function() {
                var that = this;
                clearTimeout(this.resizeTimeout);
                this.resizeTimeout = setTimeout(function() {
                    that.refresh()
                }, this.options.resizePolling)
            },
            resetPosition: function(time) {
                var x = this.x,
                    y = this.y;
                time = time || 0;
                if (!this.hasHorizontalScroll || this.x > 0) {
                    x = 0
                } else if (this.x < this.maxScrollX) {
                    x = this.maxScrollX
                }
                if (!this.hasVerticalScroll || this.y > 0) {
                    y = 0
                } else if (this.y < this.maxScrollY) {
                    y = this.maxScrollY
                }
                if (x === this.x && y === this.y) {
                    return false
                }
                if (this.options.ptr && this.y > 44 && this.startY * -1 < $(window).height() && !this.ptrLock) {
                    y = this.options.ptrOffset || 44;
                    this._execEvent("ptr");
                    this.ptrLock = true;
                    var self = this;
                    setTimeout(function() {
                        self.ptrLock = false
                    }, 500)
                }
                this.scrollTo(x, y, time, this.options.bounceEasing);
                return true
            },
            disable: function() {
                this.enabled = false
            },
            enable: function() {
                this.enabled = true
            },
            refresh: function() {
                this.wrapperWidth = this.wrapper.clientWidth;
                this.wrapperHeight = this.wrapper.clientHeight;
                this.scrollerWidth = this.scroller.offsetWidth;
                this.scrollerHeight = this.scroller.offsetHeight;
                this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
                this.maxScrollY = this.wrapperHeight - this.scrollerHeight;
                this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
                this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;
                if (!this.hasHorizontalScroll) {
                    this.maxScrollX = 0;
                    this.scrollerWidth = this.wrapperWidth
                }
                if (!this.hasVerticalScroll) {
                    this.maxScrollY = 0;
                    this.scrollerHeight = this.wrapperHeight
                }
                this.endTime = 0;
                this.directionX = 0;
                this.directionY = 0;
                this.wrapperOffset = utils.offset(this.wrapper);
                this._execEvent("refresh");
                this.resetPosition()
            },
            on: function(type, fn) {
                if (!this._events[type]) {
                    this._events[type] = []
                }
                this._events[type].push(fn)
            },
            off: function(type, fn) {
                if (!this._events[type]) {
                    return
                }
                var index = this._events[type].indexOf(fn);
                if (index > -1) {
                    this._events[type].splice(index, 1)
                }
            },
            _execEvent: function(type) {
                if (!this._events[type]) {
                    return
                }
                var i = 0,
                    l = this._events[type].length;
                if (!l) {
                    return
                }
                for (; i < l; i++) {
                    this._events[type][i].apply(this, [].slice.call(arguments, 1))
                }
            },
            scrollBy: function(x, y, time, easing) {
                x = this.x + x;
                y = this.y + y;
                time = time || 0;
                this.scrollTo(x, y, time, easing)
            },
            scrollTo: function(x, y, time, easing) {
                easing = easing || utils.ease.circular;
                this.isInTransition = this.options.useTransition && time > 0;
                if (!time || this.options.useTransition && easing.style) {
                    this._transitionTimingFunction(easing.style);
                    this._transitionTime(time);
                    this._translate(x, y)
                } else {
                    this._animate(x, y, time, easing.fn)
                }
            },
            scrollToElement: function(el, time, offsetX, offsetY, easing) {
                el = el.nodeType ? el : this.scroller.querySelector(el);
                if (!el) {
                    return
                }
                var pos = utils.offset(el);
                pos.left -= this.wrapperOffset.left;
                pos.top -= this.wrapperOffset.top;
                if (offsetX === true) {
                    offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2)
                }
                if (offsetY === true) {
                    offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2)
                }
                pos.left -= offsetX || 0;
                pos.top -= offsetY || 0;
                pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
                pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top;
                time = time === undefined || time === null || time === "auto" ? Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top)) : time;
                this.scrollTo(pos.left, pos.top, time, easing)
            },
            _transitionTime: function(time) {
                time = time || 0;
                this.scrollerStyle[utils.style.transitionDuration] = time + "ms";
                if (!time && utils.isBadAndroid) {
                    this.scrollerStyle[utils.style.transitionDuration] = "0.001s"
                }
                if (this.indicators) {
                    for (var i = this.indicators.length; i--;) {
                        this.indicators[i].transitionTime(time)
                    }
                }
            },
            _transitionTimingFunction: function(easing) {
                this.scrollerStyle[utils.style.transitionTimingFunction] = easing;
                if (this.indicators) {
                    for (var i = this.indicators.length; i--;) {
                        this.indicators[i].transitionTimingFunction(easing)
                    }
                }
            },
            _translate: function(x, y) {
                if (this.options.useTransform) {
                    this.scrollerStyle[utils.style.transform] = "translate(" + x + "px," + y + "px)" + this.translateZ
                } else {
                    x = Math.round(x);
                    y = Math.round(y);
                    this.scrollerStyle.left = x + "px";
                    this.scrollerStyle.top = y + "px"
                }
                this.x = x;
                this.y = y;
                if (this.indicators) {
                    for (var i = this.indicators.length; i--;) {
                        this.indicators[i].updatePosition()
                    }
                }
            },
            _initEvents: function(remove) {
                var eventType = remove ? utils.removeEvent : utils.addEvent,
                    target = this.options.bindToWrapper ? this.wrapper : window;
                eventType(window, "orientationchange", this);
                eventType(window, "resize", this);
                if (this.options.click) {
                    eventType(this.wrapper, "click", this, true)
                }
                if (!this.options.disableMouse) {
                    eventType(this.wrapper, "mousedown", this);
                    eventType(target, "mousemove", this);
                    eventType(target, "mousecancel", this);
                    eventType(target, "mouseup", this)
                }
                if (utils.hasPointer && !this.options.disablePointer) {
                    eventType(this.wrapper, utils.prefixPointerEvent("pointerdown"), this);
                    eventType(target, utils.prefixPointerEvent("pointermove"), this);
                    eventType(target, utils.prefixPointerEvent("pointercancel"), this);
                    eventType(target, utils.prefixPointerEvent("pointerup"), this)
                }
                if (utils.hasTouch && !this.options.disableTouch) {
                    eventType(this.wrapper, "touchstart", this);
                    eventType(target, "touchmove", this);
                    eventType(target, "touchcancel", this);
                    eventType(target, "touchend", this)
                }
                eventType(this.scroller, "transitionend", this);
                eventType(this.scroller, "webkitTransitionEnd", this);
                eventType(this.scroller, "oTransitionEnd", this);
                eventType(this.scroller, "MSTransitionEnd", this)
            },
            getComputedPosition: function() {
                var matrix = window.getComputedStyle(this.scroller, null),
                    x, y;
                if (this.options.useTransform) {
                    matrix = matrix[utils.style.transform].split(")")[0].split(", ");
                    x = +(matrix[12] || matrix[4]);
                    y = +(matrix[13] || matrix[5])
                } else {
                    x = +matrix.left.replace(/[^-\d.]/g, "");
                    y = +matrix.top.replace(/[^-\d.]/g, "")
                }
                return {
                    x: x,
                    y: y
                }
            },
            _initIndicators: function() {
                var interactive = this.options.interactiveScrollbars,
                    customStyle = typeof this.options.scrollbars !== "string",
                    indicators = [],
                    indicator;
                var that = this;
                this.indicators = [];
                if (this.options.scrollbars) {
                    if (this.options.scrollY) {
                        indicator = {
                            el: createDefaultScrollbar("v", interactive, this.options.scrollbars),
                            interactive: interactive,
                            defaultScrollbars: true,
                            customStyle: customStyle,
                            resize: this.options.resizeScrollbars,
                            shrink: this.options.shrinkScrollbars,
                            fade: this.options.fadeScrollbars,
                            listenX: false
                        };
                        this.wrapper.appendChild(indicator.el);
                        indicators.push(indicator)
                    }
                    if (this.options.scrollX) {
                        indicator = {
                            el: createDefaultScrollbar("h", interactive, this.options.scrollbars),
                            interactive: interactive,
                            defaultScrollbars: true,
                            customStyle: customStyle,
                            resize: this.options.resizeScrollbars,
                            shrink: this.options.shrinkScrollbars,
                            fade: this.options.fadeScrollbars,
                            listenY: false
                        };
                        this.wrapper.appendChild(indicator.el);
                        indicators.push(indicator)
                    }
                }
                if (this.options.indicators) {
                    indicators = indicators.concat(this.options.indicators)
                }
                for (var i = indicators.length; i--;) {
                    this.indicators.push(new Indicator(this, indicators[i]))
                }

                function _indicatorsMap(fn) {
                    for (var i = that.indicators.length; i--;) {
                        fn.call(that.indicators[i])
                    }
                }
                if (this.options.fadeScrollbars) {
                    this.on("scrollEnd", function() {
                        _indicatorsMap(function() {
                            this.fade()
                        })
                    });
                    this.on("scrollCancel", function() {
                        _indicatorsMap(function() {
                            this.fade()
                        })
                    });
                    this.on("scrollStart", function() {
                        _indicatorsMap(function() {
                            this.fade(1)
                        })
                    });
                    this.on("beforeScrollStart", function() {
                        _indicatorsMap(function() {
                            this.fade(1, true)
                        })
                    })
                }
                this.on("refresh", function() {
                    _indicatorsMap(function() {
                        this.refresh()
                    })
                });
                this.on("destroy", function() {
                    _indicatorsMap(function() {
                        this.destroy()
                    });
                    delete this.indicators
                })
            },
            _initWheel: function() {
                utils.addEvent(this.wrapper, "wheel", this);
                utils.addEvent(this.wrapper, "mousewheel", this);
                utils.addEvent(this.wrapper, "DOMMouseScroll", this);
                this.on("destroy", function() {
                    utils.removeEvent(this.wrapper, "wheel", this);
                    utils.removeEvent(this.wrapper, "mousewheel", this);
                    utils.removeEvent(this.wrapper, "DOMMouseScroll", this)
                })
            },
            _wheel: function(e) {
                if (!this.enabled) {
                    return
                }
                e.preventDefault();
                e.stopPropagation();
                var wheelDeltaX, wheelDeltaY, newX, newY, that = this;
                if (this.wheelTimeout === undefined) {
                    that._execEvent("scrollStart")
                }
                clearTimeout(this.wheelTimeout);
                this.wheelTimeout = setTimeout(function() {
                    that._execEvent("scrollEnd");
                    that.wheelTimeout = undefined
                }, 400);
                if ("deltaX" in e) {
                    if (e.deltaMode === 1) {
                        wheelDeltaX = -e.deltaX * this.options.mouseWheelSpeed;
                        wheelDeltaY = -e.deltaY * this.options.mouseWheelSpeed
                    } else {
                        wheelDeltaX = -e.deltaX;
                        wheelDeltaY = -e.deltaY
                    }
                } else if ("wheelDeltaX" in e) {
                    wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
                    wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed
                } else if ("wheelDelta" in e) {
                    wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed
                } else if ("detail" in e) {
                    wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed
                } else {
                    return
                }
                wheelDeltaX *= this.options.invertWheelDirection;
                wheelDeltaY *= this.options.invertWheelDirection;
                if (!this.hasVerticalScroll) {
                    wheelDeltaX = wheelDeltaY;
                    wheelDeltaY = 0
                }
                if (this.options.snap) {
                    newX = this.currentPage.pageX;
                    newY = this.currentPage.pageY;
                    if (wheelDeltaX > 0) {
                        newX--
                    } else if (wheelDeltaX < 0) {
                        newX++
                    }
                    if (wheelDeltaY > 0) {
                        newY--
                    } else if (wheelDeltaY < 0) {
                        newY++
                    }
                    this.goToPage(newX, newY);
                    return
                }
                newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
                newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);
                if (newX > 0) {
                    newX = 0
                } else if (newX < this.maxScrollX) {
                    newX = this.maxScrollX
                }
                if (newY > 0) {
                    newY = 0
                } else if (newY < this.maxScrollY) {
                    newY = this.maxScrollY
                }
                this.scrollTo(newX, newY, 0);
                this._execEvent("scroll")
            },
            _initSnap: function() {
                this.currentPage = {};
                if (typeof this.options.snap === "string") {
                    this.options.snap = this.scroller.querySelectorAll(this.options.snap)
                }
                this.on("refresh", function() {
                    var i = 0,
                        l, m = 0,
                        n, cx, cy, x = 0,
                        y, stepX = this.options.snapStepX || this.wrapperWidth,
                        stepY = this.options.snapStepY || this.wrapperHeight,
                        el;
                    this.pages = [];
                    if (!this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight) {
                        return
                    }
                    if (this.options.snap === true) {
                        cx = Math.round(stepX / 2);
                        cy = Math.round(stepY / 2);
                        while (x > -this.scrollerWidth) {
                            this.pages[i] = [];
                            l = 0;
                            y = 0;
                            while (y > -this.scrollerHeight) {
                                this.pages[i][l] = {
                                    x: Math.max(x, this.maxScrollX),
                                    y: Math.max(y, this.maxScrollY),
                                    width: stepX,
                                    height: stepY,
                                    cx: x - cx,
                                    cy: y - cy
                                };
                                y -= stepY;
                                l++
                            }
                            x -= stepX;
                            i++
                        }
                    } else {
                        el = this.options.snap;
                        l = el.length;
                        n = -1;
                        for (; i < l; i++) {
                            if (i === 0 || el[i].offsetLeft <= el[i - 1].offsetLeft) {
                                m = 0;
                                n++
                            }
                            if (!this.pages[m]) {
                                this.pages[m] = []
                            }
                            x = Math.max(-el[i].offsetLeft, this.maxScrollX);
                            y = Math.max(-el[i].offsetTop, this.maxScrollY);
                            cx = x - Math.round(el[i].offsetWidth / 2);
                            cy = y - Math.round(el[i].offsetHeight / 2);
                            this.pages[m][n] = {
                                x: x,
                                y: y,
                                width: el[i].offsetWidth,
                                height: el[i].offsetHeight,
                                cx: cx,
                                cy: cy
                            };
                            if (x > this.maxScrollX) {
                                m++
                            }
                        }
                    }
                    this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);
                    if (this.options.snapThreshold % 1 === 0) {
                        this.snapThresholdX = this.options.snapThreshold;
                        this.snapThresholdY = this.options.snapThreshold
                    } else {
                        this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
                        this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold)
                    }
                });
                this.on("flick", function() {
                    var time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(this.x - this.startX), 1e3), Math.min(Math.abs(this.y - this.startY), 1e3)), 300);
                    this.goToPage(this.currentPage.pageX + this.directionX, this.currentPage.pageY + this.directionY, time)
                })
            },
            _nearestSnap: function(x, y) {
                if (!this.pages.length) {
                    return {
                        x: 0,
                        y: 0,
                        pageX: 0,
                        pageY: 0
                    }
                }
                var i = 0,
                    l = this.pages.length,
                    m = 0;
                if (Math.abs(x - this.absStartX) < this.snapThresholdX && Math.abs(y - this.absStartY) < this.snapThresholdY) {
                    return this.currentPage
                }
                if (x > 0) {
                    x = 0
                } else if (x < this.maxScrollX) {
                    x = this.maxScrollX
                }
                if (y > 0) {
                    y = 0
                } else if (y < this.maxScrollY) {
                    y = this.maxScrollY
                }
                for (; i < l; i++) {
                    if (x >= this.pages[i][0].cx) {
                        x = this.pages[i][0].x;
                        break
                    }
                }
                l = this.pages[i].length;
                for (; m < l; m++) {
                    if (y >= this.pages[0][m].cy) {
                        y = this.pages[0][m].y;
                        break
                    }
                }
                if (i === this.currentPage.pageX) {
                    i += this.directionX;
                    if (i < 0) {
                        i = 0
                    } else if (i >= this.pages.length) {
                        i = this.pages.length - 1
                    }
                    x = this.pages[i][0].x
                }
                if (m === this.currentPage.pageY) {
                    m += this.directionY;
                    if (m < 0) {
                        m = 0
                    } else if (m >= this.pages[0].length) {
                        m = this.pages[0].length - 1
                    }
                    y = this.pages[0][m].y
                }
                return {
                    x: x,
                    y: y,
                    pageX: i,
                    pageY: m
                }
            },
            goToPage: function(x, y, time, easing) {
                easing = easing || this.options.bounceEasing;
                if (x >= this.pages.length) {
                    x = this.pages.length - 1
                } else if (x < 0) {
                    x = 0
                }
                if (y >= this.pages[x].length) {
                    y = this.pages[x].length - 1
                } else if (y < 0) {
                    y = 0
                }
                var posX = this.pages[x][y].x,
                    posY = this.pages[x][y].y;
                time = time === undefined ? this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(posX - this.x), 1e3), Math.min(Math.abs(posY - this.y), 1e3)), 300) : time;
                this.currentPage = {
                    x: posX,
                    y: posY,
                    pageX: x,
                    pageY: y
                };
                this.scrollTo(posX, posY, time, easing)
            },
            next: function(time, easing) {
                var x = this.currentPage.pageX,
                    y = this.currentPage.pageY;
                x++;
                if (x >= this.pages.length && this.hasVerticalScroll) {
                    x = 0;
                    y++
                }
                this.goToPage(x, y, time, easing)
            },
            prev: function(time, easing) {
                var x = this.currentPage.pageX,
                    y = this.currentPage.pageY;
                x--;
                if (x < 0 && this.hasVerticalScroll) {
                    x = 0;
                    y--
                }
                this.goToPage(x, y, time, easing)
            },
            _initKeys: function() {
                var keys = {
                    pageUp: 33,
                    pageDown: 34,
                    end: 35,
                    home: 36,
                    left: 37,
                    up: 38,
                    right: 39,
                    down: 40
                };
                var i;
                if (typeof this.options.keyBindings === "object") {
                    for (i in this.options.keyBindings) {
                        if (typeof this.options.keyBindings[i] === "string") {
                            this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0)
                        }
                    }
                } else {
                    this.options.keyBindings = {}
                }
                for (i in keys) {
                    this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i]
                }
                utils.addEvent(window, "keydown", this);
                this.on("destroy", function() {
                    utils.removeEvent(window, "keydown", this)
                })
            },
            _key: function(e) {
                if (!this.enabled) {
                    return
                }
                var snap = this.options.snap,
                    newX = snap ? this.currentPage.pageX : this.x,
                    newY = snap ? this.currentPage.pageY : this.y,
                    now = utils.getTime(),
                    prevTime = this.keyTime || 0,
                    acceleration = .25,
                    pos;
                if (this.options.useTransition && this.isInTransition) {
                    pos = this.getComputedPosition();
                    this._translate(Math.round(pos.x), Math.round(pos.y));
                    this.isInTransition = false
                }
                this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;
                switch (e.keyCode) {
                    case this.options.keyBindings.pageUp:
                        if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                            newX += snap ? 1 : this.wrapperWidth
                        } else {
                            newY += snap ? 1 : this.wrapperHeight
                        }
                        break;
                    case this.options.keyBindings.pageDown:
                        if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                            newX -= snap ? 1 : this.wrapperWidth
                        } else {
                            newY -= snap ? 1 : this.wrapperHeight
                        }
                        break;
                    case this.options.keyBindings.end:
                        newX = snap ? this.pages.length - 1 : this.maxScrollX;
                        newY = snap ? this.pages[0].length - 1 : this.maxScrollY;
                        break;
                    case this.options.keyBindings.home:
                        newX = 0;
                        newY = 0;
                        break;
                    case this.options.keyBindings.left:
                        newX += snap ? -1 : 5 + this.keyAcceleration >> 0;
                        break;
                    case this.options.keyBindings.up:
                        newY += snap ? 1 : 5 + this.keyAcceleration >> 0;
                        break;
                    case this.options.keyBindings.right:
                        newX -= snap ? -1 : 5 + this.keyAcceleration >> 0;
                        break;
                    case this.options.keyBindings.down:
                        newY -= snap ? 1 : 5 + this.keyAcceleration >> 0;
                        break;
                    default:
                        return
                }
                if (snap) {
                    this.goToPage(newX, newY);
                    return
                }
                if (newX > 0) {
                    newX = 0;
                    this.keyAcceleration = 0
                } else if (newX < this.maxScrollX) {
                    newX = this.maxScrollX;
                    this.keyAcceleration = 0
                }
                if (newY > 0) {
                    newY = 0;
                    this.keyAcceleration = 0
                } else if (newY < this.maxScrollY) {
                    newY = this.maxScrollY;
                    this.keyAcceleration = 0
                }
                this.scrollTo(newX, newY, 0);
                this.keyTime = now
            },
            _animate: function(destX, destY, duration, easingFn) {
                var that = this,
                    startX = this.x,
                    startY = this.y,
                    startTime = utils.getTime(),
                    destTime = startTime + duration;

                function step() {
                    var now = utils.getTime(),
                        newX, newY, easing;
                    if (now >= destTime) {
                        that.isAnimating = false;
                        that._translate(destX, destY);
                        if (!that.resetPosition(that.options.bounceTime)) {
                            that._execEvent("scrollEnd")
                        }
                        return
                    }
                    now = (now - startTime) / duration;
                    easing = easingFn(now);
                    newX = (destX - startX) * easing + startX;
                    newY = (destY - startY) * easing + startY;
                    that._translate(newX, newY);
                    if (that.isAnimating) {
                        rAF(step)
                    }
                    if (that.options.probeType === 3) {
                        that._execEvent("scroll")
                    }
                }
                this.isAnimating = true;
                step()
            },
            handleEvent: function(e) {
                switch (e.type) {
                    case "touchstart":
                    case "pointerdown":
                    case "MSPointerDown":
                    case "mousedown":
                        this._start(e);
                        break;
                    case "touchmove":
                    case "pointermove":
                    case "MSPointerMove":
                    case "mousemove":
                        this._move(e);
                        break;
                    case "touchend":
                    case "pointerup":
                    case "MSPointerUp":
                    case "mouseup":
                    case "touchcancel":
                    case "pointercancel":
                    case "MSPointerCancel":
                    case "mousecancel":
                        this._end(e);
                        break;
                    case "orientationchange":
                    case "resize":
                        this._resize();
                        break;
                    case "transitionend":
                    case "webkitTransitionEnd":
                    case "oTransitionEnd":
                    case "MSTransitionEnd":
                        this._transitionEnd(e);
                        break;
                    case "wheel":
                    case "DOMMouseScroll":
                    case "mousewheel":
                        this._wheel(e);
                        break;
                    case "keydown":
                        this._key(e);
                        break;
                    case "click":
                        if (!e._constructed) {
                            e.preventDefault();
                            e.stopPropagation()
                        }
                        break
                }
            }
        };

        function createDefaultScrollbar(direction, interactive, type) {
            var scrollbar = document.createElement("div"),
                indicator = document.createElement("div");
            if (type === true) {
                scrollbar.style.cssText = "position:absolute;z-index:9999";
                indicator.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px"
            }
            indicator.className = "iScrollIndicator";
            if (direction === "h") {
                if (type === true) {
                    scrollbar.style.cssText += ";height:5px;left:2px;right:2px;bottom:0";
                    indicator.style.height = "100%"
                }
                scrollbar.className = "iScrollHorizontalScrollbar"
            } else {
                if (type === true) {
                    scrollbar.style.cssText += ";width:5px;bottom:2px;top:2px;right:1px";
                    indicator.style.width = "100%"
                }
                scrollbar.className = "iScrollVerticalScrollbar"
            }
            scrollbar.style.cssText += ";overflow:hidden";
            if (!interactive) {
                scrollbar.style.pointerEvents = "none"
            }
            scrollbar.appendChild(indicator);
            return scrollbar
        }

        function Indicator(scroller, options) {
            this.wrapper = typeof options.el === "string" ? document.querySelector(options.el) : options.el;
            this.wrapperStyle = this.wrapper.style;
            this.indicator = this.wrapper.children[0];
            this.indicatorStyle = this.indicator.style;
            this.scroller = scroller;
            this.options = {
                listenX: true,
                listenY: true,
                interactive: false,
                resize: true,
                defaultScrollbars: false,
                shrink: false,
                fade: false,
                speedRatioX: 0,
                speedRatioY: 0
            };
            for (var i in options) {
                this.options[i] = options[i]
            }
            this.sizeRatioX = 1;
            this.sizeRatioY = 1;
            this.maxPosX = 0;
            this.maxPosY = 0;
            if (this.options.interactive) {
                if (!this.options.disableTouch) {
                    utils.addEvent(this.indicator, "touchstart", this);
                    utils.addEvent(window, "touchend", this)
                }
                if (!this.options.disablePointer) {
                    utils.addEvent(this.indicator, utils.prefixPointerEvent("pointerdown"), this);
                    utils.addEvent(window, utils.prefixPointerEvent("pointerup"), this)
                }
                if (!this.options.disableMouse) {
                    utils.addEvent(this.indicator, "mousedown", this);
                    utils.addEvent(window, "mouseup", this)
                }
            }
            if (this.options.fade) {
                this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
                this.wrapperStyle[utils.style.transitionDuration] = utils.isBadAndroid ? "0.001s" : "0ms";
                this.wrapperStyle.opacity = "0"
            }
        }
        Indicator.prototype = {
            handleEvent: function(e) {
                switch (e.type) {
                    case "touchstart":
                    case "pointerdown":
                    case "MSPointerDown":
                    case "mousedown":
                        this._start(e);
                        break;
                    case "touchmove":
                    case "pointermove":
                    case "MSPointerMove":
                    case "mousemove":
                        this._move(e);
                        break;
                    case "touchend":
                    case "pointerup":
                    case "MSPointerUp":
                    case "mouseup":
                    case "touchcancel":
                    case "pointercancel":
                    case "MSPointerCancel":
                    case "mousecancel":
                        this._end(e);
                        break
                }
            },
            destroy: function() {
                if (this.options.interactive) {
                    utils.removeEvent(this.indicator, "touchstart", this);
                    utils.removeEvent(this.indicator, utils.prefixPointerEvent("pointerdown"), this);
                    utils.removeEvent(this.indicator, "mousedown", this);
                    utils.removeEvent(window, "touchmove", this);
                    utils.removeEvent(window, utils.prefixPointerEvent("pointermove"), this);
                    utils.removeEvent(window, "mousemove", this);
                    utils.removeEvent(window, "touchend", this);
                    utils.removeEvent(window, utils.prefixPointerEvent("pointerup"), this);
                    utils.removeEvent(window, "mouseup", this)
                }
                if (this.options.defaultScrollbars) {
                    this.wrapper.parentNode.removeChild(this.wrapper)
                }
            },
            _start: function(e) {
                var point = e.touches ? e.touches[0] : e;
                e.preventDefault();
                e.stopPropagation();
                this.transitionTime();
                this.initiated = true;
                this.moved = false;
                this.lastPointX = point.pageX;
                this.lastPointY = point.pageY;
                this.startTime = utils.getTime();
                if (!this.options.disableTouch) {
                    utils.addEvent(window, "touchmove", this)
                }
                if (!this.options.disablePointer) {
                    utils.addEvent(window, utils.prefixPointerEvent("pointermove"), this)
                }
                if (!this.options.disableMouse) {
                    utils.addEvent(window, "mousemove", this)
                }
                this.scroller._execEvent("beforeScrollStart")
            },
            _move: function(e) {
                var point = e.touches ? e.touches[0] : e,
                    deltaX, deltaY, newX, newY, timestamp = utils.getTime();
                if (!this.moved) {
                    this.scroller._execEvent("scrollStart")
                }
                this.moved = true;
                deltaX = point.pageX - this.lastPointX;
                this.lastPointX = point.pageX;
                deltaY = point.pageY - this.lastPointY;
                this.lastPointY = point.pageY;
                newX = this.x + deltaX;
                newY = this.y + deltaY;
                this._pos(newX, newY);
                if (this.scroller.options.probeType === 1 && timestamp - this.startTime > 300) {
                    this.startTime = timestamp;
                    this.scroller._execEvent("scroll")
                } else if (this.scroller.options.probeType > 1) {
                    this.scroller._execEvent("scroll")
                }
                e.preventDefault();
                e.stopPropagation()
            },
            _end: function(e) {
                if (!this.initiated) {
                    return
                }
                this.initiated = false;
                e.preventDefault();
                e.stopPropagation();
                utils.removeEvent(window, "touchmove", this);
                utils.removeEvent(window, utils.prefixPointerEvent("pointermove"), this);
                utils.removeEvent(window, "mousemove", this);
                if (this.scroller.options.snap) {
                    var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);
                    var time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(this.scroller.x - snap.x), 1e3), Math.min(Math.abs(this.scroller.y - snap.y), 1e3)), 300);
                    if (this.scroller.x !== snap.x || this.scroller.y !== snap.y) {
                        this.scroller.directionX = 0;
                        this.scroller.directionY = 0;
                        this.scroller.currentPage = snap;
                        this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing)
                    }
                }
                if (this.moved) {
                    this.scroller._execEvent("scrollEnd")
                }
            },
            transitionTime: function(time) {
                time = time || 0;
                this.indicatorStyle[utils.style.transitionDuration] = time + "ms";
                if (!time && utils.isBadAndroid) {
                    this.indicatorStyle[utils.style.transitionDuration] = "0.001s"
                }
            },
            transitionTimingFunction: function(easing) {
                this.indicatorStyle[utils.style.transitionTimingFunction] = easing
            },
            refresh: function() {
                this.transitionTime();
                if (this.options.listenX && !this.options.listenY) {
                    this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? "block" : "none"
                } else if (this.options.listenY && !this.options.listenX) {
                    this.indicatorStyle.display = this.scroller.hasVerticalScroll ? "block" : "none"
                } else {
                    this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? "block" : "none"
                }
                if (this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll) {
                    utils.addClass(this.wrapper, "iScrollBothScrollbars");
                    utils.removeClass(this.wrapper, "iScrollLoneScrollbar");
                    if (this.options.defaultScrollbars && this.options.customStyle) {
                        if (this.options.listenX) {
                            this.wrapper.style.right = "8px"
                        } else {
                            this.wrapper.style.bottom = "8px"
                        }
                    }
                } else {
                    utils.removeClass(this.wrapper, "iScrollBothScrollbars");
                    utils.addClass(this.wrapper, "iScrollLoneScrollbar");
                    if (this.options.defaultScrollbars && this.options.customStyle) {
                        if (this.options.listenX) {
                            this.wrapper.style.right = "2px"
                        } else {
                            this.wrapper.style.bottom = "2px"
                        }
                    }
                }
                if (this.options.listenX) {
                    this.wrapperWidth = this.wrapper.clientWidth;
                    if (this.options.resize) {
                        this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
                        this.indicatorStyle.width = this.indicatorWidth + "px"
                    } else {
                        this.indicatorWidth = this.indicator.clientWidth
                    }
                    this.maxPosX = this.wrapperWidth - this.indicatorWidth;
                    if (this.options.shrink === "clip") {
                        this.minBoundaryX = -this.indicatorWidth + 8;
                        this.maxBoundaryX = this.wrapperWidth - 8
                    } else {
                        this.minBoundaryX = 0;
                        this.maxBoundaryX = this.maxPosX
                    }
                    this.sizeRatioX = this.options.speedRatioX || this.scroller.maxScrollX && this.maxPosX / this.scroller.maxScrollX
                }
                if (this.options.listenY) {
                    this.wrapperHeight = this.wrapper.clientHeight;
                    if (this.options.resize) {
                        this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
                        this.indicatorStyle.height = this.indicatorHeight + "px"
                    } else {
                        this.indicatorHeight = this.indicator.clientHeight
                    }
                    this.maxPosY = this.wrapperHeight - this.indicatorHeight;
                    if (this.options.shrink === "clip") {
                        this.minBoundaryY = -this.indicatorHeight + 8;
                        this.maxBoundaryY = this.wrapperHeight - 8
                    } else {
                        this.minBoundaryY = 0;
                        this.maxBoundaryY = this.maxPosY
                    }
                    this.maxPosY = this.wrapperHeight - this.indicatorHeight;
                    this.sizeRatioY = this.options.speedRatioY || this.scroller.maxScrollY && this.maxPosY / this.scroller.maxScrollY
                }
                this.updatePosition()
            },
            updatePosition: function() {
                var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
                    y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;
                if (!this.options.ignoreBoundaries) {
                    if (x < this.minBoundaryX) {
                        if (this.options.shrink === "scale") {
                            this.width = Math.max(this.indicatorWidth + x, 8);
                            this.indicatorStyle.width = this.width + "px"
                        }
                        x = this.minBoundaryX
                    } else if (x > this.maxBoundaryX) {
                        if (this.options.shrink === "scale") {
                            this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
                            this.indicatorStyle.width = this.width + "px";
                            x = this.maxPosX + this.indicatorWidth - this.width
                        } else {
                            x = this.maxBoundaryX
                        }
                    } else if (this.options.shrink === "scale" && this.width !== this.indicatorWidth) {
                        this.width = this.indicatorWidth;
                        this.indicatorStyle.width = this.width + "px"
                    }
                    if (y < this.minBoundaryY) {
                        if (this.options.shrink === "scale") {
                            this.height = Math.max(this.indicatorHeight + y * 3, 8);
                            this.indicatorStyle.height = this.height + "px"
                        }
                        y = this.minBoundaryY
                    } else if (y > this.maxBoundaryY) {
                        if (this.options.shrink === "scale") {
                            this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
                            this.indicatorStyle.height = this.height + "px";
                            y = this.maxPosY + this.indicatorHeight - this.height
                        } else {
                            y = this.maxBoundaryY
                        }
                    } else if (this.options.shrink === "scale" && this.height !== this.indicatorHeight) {
                        this.height = this.indicatorHeight;
                        this.indicatorStyle.height = this.height + "px"
                    }
                }
                this.x = x;
                this.y = y;
                if (this.scroller.options.useTransform) {
                    this.indicatorStyle[utils.style.transform] = "translate(" + x + "px," + y + "px)" + this.scroller.translateZ
                } else {
                    this.indicatorStyle.left = x + "px";
                    this.indicatorStyle.top = y + "px"
                }
            },
            _pos: function(x, y) {
                if (x < 0) {
                    x = 0
                } else if (x > this.maxPosX) {
                    x = this.maxPosX
                }
                if (y < 0) {
                    y = 0
                } else if (y > this.maxPosY) {
                    y = this.maxPosY
                }
                x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
                y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;
                this.scroller.scrollTo(x, y)
            },
            fade: function(val, hold) {
                if (hold && !this.visible) {
                    return
                }
                clearTimeout(this.fadeTimeout);
                this.fadeTimeout = null;
                var time = val ? 250 : 500,
                    delay = val ? 0 : 300;
                val = val ? "1" : "0";
                this.wrapperStyle[utils.style.transitionDuration] = time + "ms";
                this.fadeTimeout = setTimeout(function(val) {
                    this.wrapperStyle.opacity = val;
                    this.visible = +val
                }.bind(this, val), delay)
            }
        };
        IScroll.utils = utils;
        window.IScroll = IScroll
    }(window); + function($) {
        "use strict";
        var compareVersion = function(a, b) {
            var as = a.split(".");
            var bs = b.split(".");
            if (a === b) return 0;
            for (var i = 0; i < as.length; i++) {
                var x = parseInt(as[i]);
                if (!bs[i]) return 1;
                var y = parseInt(bs[i]);
                if (x < y) return -1;
                if (x > y) return 1
            }
            return 1
        };
        var _zeptoMethodCache = {
            scrollTop: $.fn.scrollTop,
            scrollLeft: $.fn.scrollLeft
        };
        (function() {
            $.extend($.fn, {
                scrollTop: function(top, dur) {
                    if (!this.length) return;
                    var scroller = this.data("scroller");
                    if (scroller && scroller.scroller) {
                        return scroller.scrollTop(top, dur)
                    } else {
                        return _zeptoMethodCache.scrollTop.apply(this, arguments)
                    }
                }
            });
            $.extend($.fn, {
                scrollLeft: function(left, dur) {
                    if (!this.length) return;
                    var scroller = this.data("scroller");
                    if (scroller && scroller.scroller) {
                        return scroller.scrollLeft(left, dur)
                    } else {
                        return _zeptoMethodCache.scrollLeft.apply(this, arguments)
                    }
                }
            })
        })();
        var Scroller = function(pageContent, _options) {
            var $pageContent = this.$pageContent = $(pageContent);
            this.options = $.extend({}, this._defaults, _options);
            var type = this.options.type;
            var useJSScroller = type === "js" || (type === "auto" && ($.os.android && compareVersion("4.4.0", $.os.version) > -1) || $.os.ios && compareVersion("6.0.0", $.os.version) > -1);
            if (useJSScroller) {
                var $pageContentInner = $pageContent.find(".content-inner");
                if (!$pageContentInner[0]) {
                    var children = $pageContent.children();
                    if (children.length < 1) {
                        $pageContent.children().wrapAll('<div class="content-inner"></div>')
                    } else {
                        $pageContent.html('<div class="content-inner">' + $pageContent.html() + "</div>")
                    }
                }
                if ($pageContent.hasClass("pull-to-refresh-content")) {
                    $pageContent.find(".content-inner").css("min-height", $(window).height() + 20 + "px")
                }
                var ptr = $(pageContent).hasClass("pull-to-refresh-content");
                var options = {
                    probeType: 1,
                    mouseWheel: true
                };
                if (ptr) {
                    options.ptr = true;
                    options.ptrOffset = 44
                }
                this.scroller = new IScroll(pageContent, options);
                this._bindEventToDomWhenJs();
                $.initPullToRefresh = $._pullToRefreshJSScroll.initPullToRefresh;
                $.pullToRefreshDone = $._pullToRefreshJSScroll.pullToRefreshDone;
                $.pullToRefreshTrigger = $._pullToRefreshJSScroll.pullToRefreshTrigger;
                $.destroyToRefresh = $._pullToRefreshJSScroll.destroyToRefresh;
                $pageContent.addClass("javascript-scroll");
                var nativeScrollTop = this.$pageContent[0].scrollTop;
                if (nativeScrollTop) {
                    this.$pageContent[0].scrollTop = 0;
                    this.scrollTop(nativeScrollTop)
                }
            } else {
                $pageContent.addClass("native-scroll")
            }
        };
        Scroller.prototype = {
            _defaults: {
                type: "native"
            },
            _bindEventToDomWhenJs: function() {
                if (this.scroller) {
                    var self = this;
                    this.scroller.on("scrollStart", function() {
                        self.$pageContent.trigger("scrollstart")
                    });
                    this.scroller.on("scroll", function() {
                        self.$pageContent.trigger("scroll")
                    });
                    this.scroller.on("scrollEnd", function() {
                        self.$pageContent.trigger("scrollend")
                    })
                } else {}
            },
            scrollTop: function(top, dur) {
                if (this.scroller) {
                    if (top !== undefined) {
                        this.scroller.scrollTo(0, -1 * top, dur)
                    } else {
                        return this.scroller.getComputedPosition().y * -1
                    }
                } else {
                    return this.$pageContent.scrollTop(top, dur)
                }
                return this
            },
            scrollLeft: function(left, dur) {
                if (this.scroller) {
                    if (left !== undefined) {
                        this.scroller.scrollTo(-1 * left, 0)
                    } else {
                        return this.scroller.getComputedPosition().x * -1
                    }
                } else {
                    return this.$pageContent.scrollTop(left, dur)
                }
                return this
            },
            on: function(event, callback) {
                if (this.scroller) {
                    this.scroller.on(event, function() {
                        callback.call(this.wrapper)
                    })
                } else {
                    this.$pageContent.on(event, callback)
                }
                return this
            },
            off: function(event, callback) {
                if (this.scroller) {
                    this.scroller.off(event, callback)
                } else {
                    this.$pageContent.off(event, callback)
                }
                return this
            },
            refresh: function() {
                if (this.scroller) this.scroller.refresh();
                return this
            },
            scrollHeight: function() {
                if (this.scroller) {
                    return this.scroller.scrollerHeight
                } else {
                    return this.$pageContent[0].scrollHeight
                }
            }
        };

        function Plugin(option) {
            var args = Array.apply(null, arguments);
            args.shift();
            var internal_return;
            this.each(function() {
                var $this = $(this);
                var options = $.extend({}, $this.dataset(), typeof option === "object" && option);
                var data = $this.data("scroller");
                if (!data) {
                    $this.data("scroller", data = new Scroller(this, options))
                }
                if (typeof option === "string" && typeof data[option] === "function") {
                    internal_return = data[option].apply(data, args);
                    if (internal_return !== undefined) return false
                }
            });
            if (internal_return !== undefined) return internal_return;
            else return this
        }
        var old = $.fn.scroller;
        $.fn.scroller = Plugin;
        $.fn.scroller.Constructor = Scroller;
        $.fn.scroller.noConflict = function() {
            $.fn.scroller = old;
            return this
        };
        $(function() {
            $('[data-toggle="scroller"]').scroller()
        });
        $.refreshScroller = function(content) {
            if (content) {
                $(content).scroller("refresh")
            } else {
                $(".javascript-scroll").each(function() {
                    $(this).scroller("refresh")
                })
            }
        };
        $.initScroller = function(option) {
            this.options = $.extend({}, typeof option === "object" && option);
            $('[data-toggle="scroller"],.content').scroller(option)
        };
        $.getScroller = function(content) {
            if (content) {
                return $(content).data("scroller")
            } else {
                return $(".content.javascript-scroll").data("scroller")
            }
        };
        $.detectScrollerType = function(content) {
            if (content) {
                if ($(content).data("scroller") && $(content).data("scroller").scroller) {
                    return "js"
                } else {
                    return "native"
                }
            }
        }
    }(Zepto); + function($) {
        "use strict";
        var refreshTime = 0;
        var initPullToRefreshJS = function(pageContainer) {
            var eventsTarget = $(pageContainer);
            if (!eventsTarget.hasClass("pull-to-refresh-content")) {
                eventsTarget = eventsTarget.find(".pull-to-refresh-content")
            }
            if (!eventsTarget || eventsTarget.length === 0) return;
            var page = eventsTarget.hasClass("content") ? eventsTarget : eventsTarget.parents(".content");
            var scroller = $.getScroller(page[0]);
            if (!scroller) return;
            var container = eventsTarget;

            function handleScroll() {
                if (container.hasClass("refreshing")) return;
                if (scroller.scrollTop() * -1 >= 44) {
                    container.removeClass("pull-down").addClass("pull-up")
                } else {
                    container.removeClass("pull-up").addClass("pull-down")
                }
            }

            function handleRefresh() {
                if (container.hasClass("refreshing")) return;
                container.removeClass("pull-down pull-up");
                container.addClass("refreshing transitioning");
                container.trigger("refresh", {
                    done: function() {
                        $.pullToRefreshDone(container)
                    }
                });
                refreshTime = +new Date
            }
            scroller.on("scroll", handleScroll);
            scroller.scroller.on("ptr", handleRefresh);

            function destroyPullToRefresh() {
                scroller.off("scroll", handleScroll);
                scroller.scroller.off("ptr", handleRefresh)
            }
            eventsTarget[0].destroyPullToRefresh = destroyPullToRefresh
        };
        var pullToRefreshDoneJS = function(container) {
            container = $(container);
            if (container.length === 0) container = $(".pull-to-refresh-content.refreshing");
            if (container.length === 0) return;
            var interval = +new Date - refreshTime;
            var timeOut = interval > 1e3 ? 0 : 1e3 - interval;
            var scroller = $.getScroller(container);
            setTimeout(function() {
                scroller.refresh();
                container.removeClass("refreshing");
                container.transitionEnd(function() {
                    container.removeClass("transitioning")
                })
            }, timeOut)
        };
        var pullToRefreshTriggerJS = function(container) {
            container = $(container);
            if (container.length === 0) container = $(".pull-to-refresh-content");
            if (container.hasClass("refreshing")) return;
            container.addClass("refreshing");
            var scroller = $.getScroller(container);
            scroller.scrollTop(44 + 1, 200);
            container.trigger("refresh", {
                done: function() {
                    $.pullToRefreshDone(container)
                }
            })
        };
        var destroyPullToRefreshJS = function(pageContainer) {
            pageContainer = $(pageContainer);
            var pullToRefreshContent = pageContainer.hasClass("pull-to-refresh-content") ? pageContainer : pageContainer.find(".pull-to-refresh-content");
            if (pullToRefreshContent.length === 0) return;
            if (pullToRefreshContent[0].destroyPullToRefresh) pullToRefreshContent[0].destroyPullToRefresh()
        };
        $._pullToRefreshJSScroll = {
            initPullToRefresh: initPullToRefreshJS,
            pullToRefreshDone: pullToRefreshDoneJS,
            pullToRefreshTrigger: pullToRefreshTriggerJS,
            destroyPullToRefresh: destroyPullToRefreshJS
        }
    }(Zepto); + function($) {
        "use strict";
        $.initPullToRefresh = function(pageContainer) {
            var eventsTarget = $(pageContainer);
            if (!eventsTarget.hasClass("pull-to-refresh-content")) {
                eventsTarget = eventsTarget.find(".pull-to-refresh-content")
            }
            if (!eventsTarget || eventsTarget.length === 0) return;
            var isTouched, isMoved, touchesStart = {},
                isScrolling, touchesDiff, touchStartTime, container, refresh = false,
                useTranslate = false,
                startTranslate = 0,
                translate, scrollTop, wasScrolled, triggerDistance, dynamicTriggerDistance;
            container = eventsTarget;
            if (container.attr("data-ptr-distance")) {
                dynamicTriggerDistance = true
            } else {
                triggerDistance = 44
            }

            function handleTouchStart(e) {
                if (isTouched) {
                    if ($.os.android) {
                        if ("targetTouches" in e && e.targetTouches.length > 1) return
                    } else return
                }
                isMoved = false;
                isTouched = true;
                isScrolling = undefined;
                wasScrolled = undefined;
                touchesStart.x = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX;
                touchesStart.y = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY;
                touchStartTime = (new Date).getTime();
                container = $(this)
            }

            function handleTouchMove(e) {
                if (!isTouched) return;
                var pageX = e.type === "touchmove" ? e.targetTouches[0].pageX : e.pageX;
                var pageY = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY;
                if (typeof isScrolling === "undefined") {
                    isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x))
                }
                if (!isScrolling) {
                    isTouched = false;
                    return
                }
                scrollTop = container[0].scrollTop;
                if (typeof wasScrolled === "undefined" && scrollTop !== 0) wasScrolled = true;
                if (!isMoved) {
                    container.removeClass("transitioning");
                    if (scrollTop > container[0].offsetHeight) {
                        isTouched = false;
                        return
                    }
                    if (dynamicTriggerDistance) {
                        triggerDistance = container.attr("data-ptr-distance");
                        if (triggerDistance.indexOf("%") >= 0) triggerDistance = container[0].offsetHeight * parseInt(triggerDistance, 10) / 100
                    }
                    startTranslate = container.hasClass("refreshing") ? triggerDistance : 0;
                    if (container[0].scrollHeight === container[0].offsetHeight || !$.os.ios) {
                        useTranslate = true
                    } else {
                        useTranslate = false
                    }
                    useTranslate = true
                }
                isMoved = true;
                touchesDiff = pageY - touchesStart.y;
                if (touchesDiff > 0 && scrollTop <= 0 || scrollTop < 0) {
                    if ($.os.ios && parseInt($.os.version.split(".")[0], 10) > 7 && scrollTop === 0 && !wasScrolled) useTranslate = true;
                    if (useTranslate) {
                        e.preventDefault();
                        translate = Math.pow(touchesDiff, .85) + startTranslate;
                        container.transform("translate3d(0," + translate + "px,0)")
                    } else {}
                    if (useTranslate && Math.pow(touchesDiff, .85) > triggerDistance || !useTranslate && touchesDiff >= triggerDistance * 2) {
                        refresh = true;
                        container.addClass("pull-up").removeClass("pull-down")
                    } else {
                        refresh = false;
                        container.removeClass("pull-up").addClass("pull-down")
                    }
                } else {
                    container.removeClass("pull-up pull-down");
                    refresh = false;
                    return
                }
            }

            function handleTouchEnd() {
                if (!isTouched || !isMoved) {
                    isTouched = false;
                    isMoved = false;
                    return
                }
                if (translate) {
                    container.addClass("transitioning");
                    translate = 0
                }
                container.transform("");
                if (refresh) {
                    container.addClass("refreshing");
                    container.trigger("refresh", {
                        done: function() {
                            $.pullToRefreshDone(container)
                        }
                    })
                } else {
                    container.removeClass("pull-down")
                }
                isTouched = false;
                isMoved = false
            }
            eventsTarget.on($.touchEvents.start, handleTouchStart);
            eventsTarget.on($.touchEvents.move, handleTouchMove);
            eventsTarget.on($.touchEvents.end, handleTouchEnd);

            function destroyPullToRefresh() {
                eventsTarget.off($.touchEvents.start, handleTouchStart);
                eventsTarget.off($.touchEvents.move, handleTouchMove);
                eventsTarget.off($.touchEvents.end, handleTouchEnd)
            }
            eventsTarget[0].destroyPullToRefresh = destroyPullToRefresh
        };
        $.pullToRefreshDone = function(container) {
            container = $(container);
            if (container.length === 0) container = $(".pull-to-refresh-content.refreshing");
            container.removeClass("refreshing").addClass("transitioning");
            container.transitionEnd(function() {
                container.removeClass("transitioning pull-up pull-down")
            })
        };
        $.pullToRefreshTrigger = function(container) {
            container = $(container);
            if (container.length === 0) container = $(".pull-to-refresh-content");
            if (container.hasClass("refreshing")) return;
            container.addClass("transitioning refreshing");
            container.trigger("refresh", {
                done: function() {
                    $.pullToRefreshDone(container)
                }
            })
        };
        $.destroyPullToRefresh = function(pageContainer) {
            pageContainer = $(pageContainer);
            var pullToRefreshContent = pageContainer.hasClass("pull-to-refresh-content") ? pageContainer : pageContainer.find(".pull-to-refresh-content");
            if (pullToRefreshContent.length === 0) return;
            if (pullToRefreshContent[0].destroyPullToRefresh) pullToRefreshContent[0].destroyPullToRefresh()
        }
    }(Zepto); + function($) {
        "use strict";

        function handleInfiniteScroll() {
            var inf = $(this);
            var scroller = $.getScroller(inf);
            var scrollTop = scroller.scrollTop();
            var scrollHeight = scroller.scrollHeight();
            var height = inf[0].offsetHeight;
            var distance = inf[0].getAttribute("data-distance");
            var virtualListContainer = inf.find(".virtual-list");
            var virtualList;
            var onTop = inf.hasClass("infinite-scroll-top");
            if (!distance) distance = 50;
            if (typeof distance === "string" && distance.indexOf("%") >= 0) {
                distance = parseInt(distance, 10) / 100 * height
            }
            if (distance > height) distance = height;
            if (onTop) {
                if (scrollTop < distance) {
                    inf.trigger("infinite")
                }
            } else {
                if (scrollTop + height >= scrollHeight - distance) {
                    if (virtualListContainer.length > 0) {
                        virtualList = virtualListContainer[0].f7VirtualList;
                        if (virtualList && !virtualList.reachEnd) return
                    }
                    inf.trigger("infinite")
                }
            }
        }
        $.attachInfiniteScroll = function(infiniteContent) {
            $.getScroller(infiniteContent).on("scroll", handleInfiniteScroll)
        };
        $.detachInfiniteScroll = function(infiniteContent) {
            $.getScroller(infiniteContent).off("scroll", handleInfiniteScroll)
        };
        $.initInfiniteScroll = function(pageContainer) {
            pageContainer = $(pageContainer);
            var infiniteContent = pageContainer.hasClass("infinite-scroll") ? pageContainer : pageContainer.find(".infinite-scroll");
            if (infiniteContent.length === 0) return;
            $.attachInfiniteScroll(infiniteContent);

            function detachEvents() {
                $.detachInfiniteScroll(infiniteContent);
                pageContainer.off("pageBeforeRemove", detachEvents)
            }
            pageContainer.on("pageBeforeRemove", detachEvents)
        }
    }(Zepto); + function($) {
        "use strict";
        $(function() {
            $(document).on("focus", ".searchbar input", function(e) {
                var $input = $(e.target);
                $input.parents(".searchbar").addClass("searchbar-active")
            });
            $(document).on("click", ".searchbar-cancel", function(e) {
                var $btn = $(e.target);
                $btn.parents(".searchbar").removeClass("searchbar-active")
            });
            $(document).on("blur", ".searchbar input", function(e) {
                var $input = $(e.target);
                $input.parents(".searchbar").removeClass("searchbar-active")
            })
        })
    }(Zepto); + function($) {
        "use strict";
        $.allowPanelOpen = true;
        $.openPanel = function(panel) {
            if (!$.allowPanelOpen) return false;
            if (panel === "left" || panel === "right") panel = ".panel-" + panel;
            panel = panel ? $(panel) : $(".panel").eq(0);
            var direction = panel.hasClass("panel-right") ? "right" : "left";
            if (panel.length === 0 || panel.hasClass("active")) return false;
            $.closePanel();
            $.allowPanelOpen = false;
            var effect = panel.hasClass("panel-reveal") ? "reveal" : "cover";
            panel.css({
                display: "block"
            }).addClass("active");
            panel.trigger("open");
            var clientLeft = panel[0].clientLeft;
            var transitionEndTarget = effect === "reveal" ? $($.getCurrentPage()) : panel;
            var openedTriggered = false;

            function panelTransitionEnd() {
                transitionEndTarget.transitionEnd(function(e) {
                    if (e.target === transitionEndTarget[0]) {
                        if (panel.hasClass("active")) {
                            panel.trigger("opened")
                        } else {
                            panel.trigger("closed")
                        }
                        $.allowPanelOpen = true
                    } else panelTransitionEnd()
                })
            }
            panelTransitionEnd();
            $(document.body).addClass("with-panel-" + direction + "-" + effect);
            return true
        };
        $.closePanel = function() {
            var activePanel = $(".panel.active");
            if (activePanel.length === 0) return false;
            var effect = activePanel.hasClass("panel-reveal") ? "reveal" : "cover";
            var panelPosition = activePanel.hasClass("panel-left") ? "left" : "right";
            activePanel.removeClass("active");
            var transitionEndTarget = effect === "reveal" ? $(".page") : activePanel;
            activePanel.trigger("close");
            $.allowPanelOpen = false;
            transitionEndTarget.transitionEnd(function() {
                if (activePanel.hasClass("active")) return;
                activePanel.css({
                    display: ""
                });
                activePanel.trigger("closed");
                $("body").removeClass("panel-closing");
                $.allowPanelOpen = true
            });
            $("body").addClass("panel-closing").removeClass("with-panel-" + panelPosition + "-" + effect)
        };
        $(document).on("click", ".open-panel", function(e) {
            var panel = $(e.target).data("panel");
            $.openPanel(panel)
        });
        $(document).on("click", ".close-panel, .panel-overlay", function(e) {
            $.closePanel()
        });
        $.initSwipePanels = function() {
            var panel, side;
            var swipePanel = $.smConfig.swipePanel;
            var swipePanelOnlyClose = $.smConfig.swipePanelOnlyClose;
            var swipePanelCloseOpposite = true;
            var swipePanelActiveArea = false;
            var swipePanelThreshold = 2;
            var swipePanelNoFollow = false;
            if (!(swipePanel || swipePanelOnlyClose)) return;
            var panelOverlay = $(".panel-overlay");
            var isTouched, isMoved, isScrolling, touchesStart = {},
                touchStartTime, touchesDiff, translate, opened, panelWidth, effect, direction;
            var views = $(".page");

            function handleTouchStart(e) {
                if (!$.allowPanelOpen || !swipePanel && !swipePanelOnlyClose || isTouched) return;
                if ($(".modal-in, .photo-browser-in").length > 0) return;
                if (!(swipePanelCloseOpposite || swipePanelOnlyClose)) {
                    if ($(".panel.active").length > 0 && !panel.hasClass("active")) return
                }
                touchesStart.x = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX;
                touchesStart.y = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY;
                if (swipePanelCloseOpposite || swipePanelOnlyClose) {
                    if ($(".panel.active").length > 0) {
                        side = $(".panel.active").hasClass("panel-left") ? "left" : "right"
                    } else {
                        if (swipePanelOnlyClose) return;
                        side = swipePanel
                    }
                    if (!side) return
                }
                panel = $(".panel.panel-" + side);
                if (!panel[0]) return;
                opened = panel.hasClass("active");
                if (swipePanelActiveArea && !opened) {
                    if (side === "left") {
                        if (touchesStart.x > swipePanelActiveArea) return
                    }
                    if (side === "right") {
                        if (touchesStart.x < window.innerWidth - swipePanelActiveArea) return
                    }
                }
                isMoved = false;
                isTouched = true;
                isScrolling = undefined;
                touchStartTime = (new Date).getTime();
                direction = undefined
            }

            function handleTouchMove(e) {
                if (!isTouched) return;
                if (!panel[0]) return;
                if (e.f7PreventPanelSwipe) return;
                var pageX = e.type === "touchmove" ? e.targetTouches[0].pageX : e.pageX;
                var pageY = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY;
                if (typeof isScrolling === "undefined") {
                    isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x))
                }
                if (isScrolling) {
                    isTouched = false;
                    return
                }
                if (!direction) {
                    if (pageX > touchesStart.x) {
                        direction = "to-right"
                    } else {
                        direction = "to-left"
                    }
                    if (side === "left" && (direction === "to-left" && !panel.hasClass("active")) || side === "right" && (direction === "to-right" && !panel.hasClass("active"))) {
                        isTouched = false;
                        return
                    }
                }
                if (swipePanelNoFollow) {
                    var timeDiff = (new Date).getTime() - touchStartTime;
                    if (timeDiff < 300) {
                        if (direction === "to-left") {
                            if (side === "right") $.openPanel(side);
                            if (side === "left" && panel.hasClass("active")) $.closePanel()
                        }
                        if (direction === "to-right") {
                            if (side === "left") $.openPanel(side);
                            if (side === "right" && panel.hasClass("active")) $.closePanel()
                        }
                    }
                    isTouched = false;
                    isMoved = false;
                    return
                }
                if (!isMoved) {
                    effect = panel.hasClass("panel-cover") ? "cover" : "reveal";
                    if (!opened) {
                        panel.show();
                        panelOverlay.show()
                    }
                    panelWidth = panel[0].offsetWidth;
                    panel.transition(0)
                }
                isMoved = true;
                e.preventDefault();
                var threshold = opened ? 0 : -swipePanelThreshold;
                if (side === "right") threshold = -threshold;
                touchesDiff = pageX - touchesStart.x + threshold;
                if (side === "right") {
                    translate = touchesDiff - (opened ? panelWidth : 0);
                    if (translate > 0) translate = 0;
                    if (translate < -panelWidth) {
                        translate = -panelWidth
                    }
                } else {
                    translate = touchesDiff + (opened ? panelWidth : 0);
                    if (translate < 0) translate = 0;
                    if (translate > panelWidth) {
                        translate = panelWidth
                    }
                }
                if (effect === "reveal") {
                    views.transform("translate3d(" + translate + "px,0,0)").transition(0);
                    panelOverlay.transform("translate3d(" + translate + "px,0,0)")
                } else {
                    panel.transform("translate3d(" + translate + "px,0,0)").transition(0)
                }
            }

            function handleTouchEnd(e) {
                if (!isTouched || !isMoved) {
                    isTouched = false;
                    isMoved = false;
                    return
                }
                isTouched = false;
                isMoved = false;
                var timeDiff = (new Date).getTime() - touchStartTime;
                var action;
                var edge = translate === 0 || Math.abs(translate) === panelWidth;
                if (!opened) {
                    if (translate === 0) {
                        action = "reset"
                    } else if (timeDiff < 300 && Math.abs(translate) > 0 || timeDiff >= 300 && Math.abs(translate) >= panelWidth / 2) {
                        action = "swap"
                    } else {
                        action = "reset"
                    }
                } else {
                    if (translate === -panelWidth) {
                        action = "reset"
                    } else if (timeDiff < 300 && Math.abs(translate) >= 0 || timeDiff >= 300 && Math.abs(translate) <= panelWidth / 2) {
                        if (side === "left" && translate === panelWidth) action = "reset";
                        else action = "swap"
                    } else {
                        action = "reset"
                    }
                }
                if (action === "swap") {
                    $.allowPanelOpen = true;
                    if (opened) {
                        $.closePanel();
                        if (edge) {
                            panel.css({
                                display: ""
                            });
                            $("body").removeClass("panel-closing")
                        }
                    } else {
                        $.openPanel(side)
                    }
                    if (edge) $.allowPanelOpen = true
                }
                if (action === "reset") {
                    if (opened) {
                        $.allowPanelOpen = true;
                        $.openPanel(side)
                    } else {
                        $.closePanel();
                        if (edge) {
                            $.allowPanelOpen = true;
                            panel.css({
                                display: ""
                            })
                        } else {
                            var target = effect === "reveal" ? views : panel;
                            $("body").addClass("panel-closing");
                            target.transitionEnd(function() {
                                $.allowPanelOpen = true;
                                panel.css({
                                    display: ""
                                });
                                $("body").removeClass("panel-closing")
                            })
                        }
                    }
                }
                if (effect === "reveal") {
                    views.transition("");
                    views.transform("")
                }
                panel.transition("").transform("");
                panelOverlay.css({
                    display: ""
                }).transform("")
            }
            $(document).on($.touchEvents.start, handleTouchStart);
            $(document).on($.touchEvents.move, handleTouchMove);
            $(document).on($.touchEvents.end, handleTouchEnd)
        };
        $.initSwipePanels()
    }(Zepto); + function($) {
        "use strict";
        if (!window.CustomEvent) {
            window.CustomEvent = function(type, config) {
                var e = document.createEvent("CustomEvent");
                e.initCustomEvent(type, config.bubbles, config.cancelable, config.detail, config.id);
                return e
            }
        }
        var Router = function() {
            this.state = sessionStorage;
            this.state.setItem("stateid", parseInt(this.state.getItem("stateid") || 1) + 1);
            this.state.setItem("currentStateID", this.state.getItem("stateid"));
            this.stack = sessionStorage;
            this.stack.setItem("back", "[]");
            this.stack.setItem("forward", "[]");
            this.init();
            this.xhr = null;
            this.newLoaded = true
        };
        Router.prototype.defaults = {};
        Router.prototype.init = function() {
            var currentPage = this.getCurrentPage(),
                page1st = $(".page").eq(0);
            if (!currentPage[0]) currentPage = page1st.addClass("page-current");
            var hash = location.hash;
            if (currentPage[0] && !currentPage[0].id) currentPage[0].id = hash ? hash.slice(1) : this.genRandomID();
            if (!currentPage[0]) throw new Error("can't find .page element");
            var newCurrentPage = $(hash);
            if (newCurrentPage[0] && (!currentPage[0] || hash.slice(1) !== currentPage[0].id)) {
                currentPage.removeClass("page-current");
                newCurrentPage.addClass("page-current");
                currentPage = newCurrentPage
            }
            var id = this.genStateID(),
                curUrl = location.href,
                entryUrl = curUrl.split("#")[0];
            history.replaceState({
                url: curUrl,
                id: id
            }, "", curUrl);
            this.setCurrentStateID(id);
            this.pushBack({
                url: entryUrl,
                pageid: "#" + page1st[0].id,
                id: id
            });
            window.addEventListener("popstate", $.proxy(this.onpopstate, this))
        };
        Router.prototype.loadPage = function(url) {
            this.newLoaded && (this.newLoaded = false);
            this.getPage(url, function(page) {
                var pageid = this.getCurrentPage()[0].id;
                this.pushBack({
                    url: url,
                    pageid: "#" + pageid,
                    id: this.getCurrentStateID()
                });
                var forward = JSON.parse(this.state.getItem("forward") || "[]");
                for (var i = 0; i < forward.length; i++) {
                    $(forward[i].pageid).each(function() {
                        var $page = $(this);
                        if ($page.data("page-remote")) $page.remove()
                    })
                }
                this.state.setItem("forward", "[]");
                page.insertAfter($(".page")[0]);
                this.animatePages(this.getCurrentPage(), page);
                var id = this.genStateID();
                this.setCurrentStateID(id);
                this.pushState(url, id);
                this.forwardStack = []
            })
        };
        Router.prototype.animatePages = function(leftPage, rightPage, leftToRight) {
            var removeClasses = "page-left page-right page-current page-from-center-to-left page-from-center-to-right page-from-right-to-center page-from-left-to-center";
            var self = this;
            if (!leftToRight) {
                rightPage.trigger("pageAnimationStart", [rightPage[0].id, rightPage]);
                leftPage.removeClass(removeClasses).addClass("page-from-center-to-left");
                rightPage.removeClass(removeClasses).addClass("page-from-right-to-center");
                leftPage.animationEnd(function() {
                    leftPage.removeClass(removeClasses)
                });
                rightPage.animationEnd(function() {
                    rightPage.removeClass(removeClasses).addClass("page-current");
                    rightPage.trigger("pageAnimationEnd", [rightPage[0].id, rightPage]);
                    rightPage.trigger("pageInitInternal", [rightPage[0].id, rightPage])
                })
            } else {
                leftPage.trigger("pageAnimationStart", [rightPage[0].id, rightPage]);
                leftPage.removeClass(removeClasses).addClass("page-from-left-to-center");
                rightPage.removeClass(removeClasses).addClass("page-from-center-to-right");
                leftPage.animationEnd(function() {
                    leftPage.removeClass(removeClasses).addClass("page-current");
                    leftPage.trigger("pageAnimationEnd", [leftPage[0].id, leftPage]);
                    leftPage.trigger("pageReinit", [leftPage[0].id, leftPage])
                });
                rightPage.animationEnd(function() {
                    rightPage.removeClass(removeClasses)
                })
            }
        };
        Router.prototype.getCurrentPage = function() {
            return $(".page-current")
        };
        Router.prototype.forward = function(url) {
            var stack = JSON.parse(this.stack.getItem("forward"));
            if (stack.length) {
                history.forward()
            } else {
                location.href = url
            }
        };
        Router.prototype.back = function(url) {
            var stack = JSON.parse(this.stack.getItem("back"));
            if (stack.length) {
                history.back()
            } else if (url) {
                location.href = url
            } else {
                console.warn("[router.back]: can not back")
            }
        };
        Router.prototype._back = function(url) {
            var h = this.popBack();
            var currentPage = this.getCurrentPage();
            var newPage = $(h.pageid);
            if (!newPage[0]) return;
            this.pushForward({
                url: location.href,
                pageid: "#" + currentPage[0].id,
                id: this.getCurrentStateID()
            });
            this.setCurrentStateID(h.id);
            this.animatePages(newPage, currentPage, true)
        };
        Router.prototype._forward = function() {
            var h = this.popForward();
            var currentPage = this.getCurrentPage();
            var newPage = $(h.pageid);
            if (!newPage[0]) return;
            this.pushBack({
                url: location.href,
                pageid: "#" + currentPage[0].id,
                id: this.getCurrentStateID()
            });
            this.setCurrentStateID(h.id);
            this.animatePages(currentPage, newPage)
        };
        Router.prototype.pushState = function(url, id) {
            history.pushState({
                url: url,
                id: id
            }, "", url)
        };
        Router.prototype.onpopstate = function(d) {
            var state = d.state;
            if (!state || this.newLoaded) {
                this.newLoaded = false;
                return
            }
            if (state.id === this.getCurrentStateID()) {
                return false
            }
            var forward = state.id > this.getCurrentStateID();
            if (forward) this._forward();
            else this._back(state.url)
        };
        Router.prototype.getPage = function(url, callback) {
            if (url[0] === "#") return callback.apply(this, [$(url)]);
            this.dispatch("pageLoadStart");
            if (this.xhr && this.xhr.readyState < 4) {
                this.xhr.onreadystatechange = function() {};
                this.xhr.abort();
                this.dispatch("pageLoadCancel")
            }
            var self = this;
            this.xhr = $.ajax({
                url: url,
                success: $.proxy(function(data, s, xhr) {
                    var $page = this.parseXHR(xhr);
                    if (!$page[0].id) $page[0].id = this.genRandomID();
                    $page.data("page-remote", 1);
                    callback.apply(this, [$page])
                }, this),
                error: function() {
                    self.dispatch("pageLoadError")
                },
                complete: function() {
                    self.dispatch("pageLoadComplete")
                }
            })
        };
        Router.prototype.parseXHR = function(xhr) {
            var response = xhr.responseText;
            var html = response.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[1];
            if (!html) html = response;
            html = "<div>" + html + "</div>";
            var tmp = $(html);
            tmp.find(".popup, .panel, .panel-overlay").appendTo(document.body);
            var $page = tmp.find(".page");
            if (!$page[0]) $page = tmp.addClass("page");
            return $page
        };
        Router.prototype.genStateID = function() {
            var id = parseInt(this.state.getItem("stateid")) + 1;
            this.state.setItem("stateid", id);
            return id
        };
        Router.prototype.getCurrentStateID = function() {
            return parseInt(this.state.getItem("currentStateID"))
        };
        Router.prototype.setCurrentStateID = function(id) {
            this.state.setItem("currentStateID", id)
        };
        Router.prototype.genRandomID = function() {
            return "page-" + +new Date
        };
        Router.prototype.popBack = function() {
            var stack = JSON.parse(this.stack.getItem("back"));
            if (!stack.length) return null;
            var h = stack.splice(stack.length - 1, 1)[0];
            this.stack.setItem("back", JSON.stringify(stack));
            return h
        };
        Router.prototype.pushBack = function(h) {
            var stack = JSON.parse(this.stack.getItem("back"));
            stack.push(h);
            this.stack.setItem("back", JSON.stringify(stack))
        };
        Router.prototype.popForward = function() {
            var stack = JSON.parse(this.stack.getItem("forward"));
            if (!stack.length) return null;
            var h = stack.splice(stack.length - 1, 1)[0];
            this.stack.setItem("forward", JSON.stringify(stack));
            return h
        };
        Router.prototype.pushForward = function(h) {
            var stack = JSON.parse(this.stack.getItem("forward"));
            stack.push(h);
            this.stack.setItem("forward", JSON.stringify(stack))
        };
        Router.prototype.dispatch = function(event) {
            var e = new CustomEvent(event, {
                bubbles: true,
                cancelable: true
            });
            window.dispatchEvent(e)
        };
        $(function() {
            if (!$.smConfig.router) return;
            var router = $.router = new Router;
            $(document).on("click", "a", function(e) {
                var $target = $(e.currentTarget);
                if ($target.hasClass("external") || $target[0].hasAttribute("external") || $target.hasClass("tab-link") || $target.hasClass("open-popup") || $target.hasClass("open-panel")) return;
                e.preventDefault();
                var url = $target.attr("href");
                if ($target.hasClass("back")) {
                    router.back(url);
                    return
                }
                if (!url || url === "#") return;
                router.loadPage(url)
            })
        })
    }(Zepto); + function($) {
        "use strict";
        var getPage = function() {
            var $page = $(".page-current");
            if (!$page[0]) $page = $(".page").addClass("page-current");
            return $page
        };
        $.initPage = function(page) {
            var $page = getPage();
            if (!$page[0]) $page = $(document.body);
            var $content = $page.hasClass("content") ? $page : $page.find(".content");
            $content.scroller();
            $.initPullToRefresh($content);
            $.initInfiniteScroll($content);
            $.initCalendar($content);
            if ($.initSwiper) $.initSwiper($content)
        };
        if ($.smConfig.showPageLoadingIndicator) {
            $(window).on("pageLoadStart", function() {
                $.showIndicator()
            });
            $(document).on("pageAnimationStart", function() {
                $.hideIndicator()
            });
            $(window).on("pageLoadCancel", function() {
                $.hideIndicator()
            });
            $(window).on("pageLoadError", function() {
                $.hideIndicator();
                $.toast("加载失败")
            })
        }
        $.init = function() {
            var $page = getPage();
            var id = $page[0].id;
            $.initPage();
            $page.trigger("pageInit", [id, $page])
        };
        $(function() {
            if ($.smConfig.autoInit) {
                $.init()
            }
            $(document).on("pageInitInternal", function(e, id, page) {
                $.init()
            })
        })
    }(Zepto)
});
define("xg/jx-business/1.0.0/c/js/base/sm-extend-debug", [], function(require, exports, module) {
    + function($) {
        "use strict";
        var Swiper = function(container, params) {
            var defaults = this.defaults;
            var initalVirtualTranslate = params && params.virtualTranslate;
            params = params || {};
            for (var def in defaults) {
                if (typeof params[def] === "undefined") {
                    params[def] = defaults[def]
                } else if (typeof params[def] === "object") {
                    for (var deepDef in defaults[def]) {
                        if (typeof params[def][deepDef] === "undefined") {
                            params[def][deepDef] = defaults[def][deepDef]
                        }
                    }
                }
            }
            var s = this;
            s.params = params;
            s.classNames = [];
            s.$ = $;
            s.container = $(container);
            if (s.container.length === 0) return;
            if (s.container.length > 1) {
                s.container.each(function() {
                    new $.Swiper(this, params)
                });
                return
            }
            s.container[0].swiper = s;
            s.container.data("swiper", s);
            s.classNames.push("swiper-container-" + s.params.direction);
            if (s.params.freeMode) {
                s.classNames.push("swiper-container-free-mode")
            }
            if (!s.support.flexbox) {
                s.classNames.push("swiper-container-no-flexbox");
                s.params.slidesPerColumn = 1
            }
            if (s.params.parallax || s.params.watchSlidesVisibility) {
                s.params.watchSlidesProgress = true
            }
            if (["cube", "coverflow"].indexOf(s.params.effect) >= 0) {
                if (s.support.transforms3d) {
                    s.params.watchSlidesProgress = true;
                    s.classNames.push("swiper-container-3d")
                } else {
                    s.params.effect = "slide"
                }
            }
            if (s.params.effect !== "slide") {
                s.classNames.push("swiper-container-" + s.params.effect)
            }
            if (s.params.effect === "cube") {
                s.params.resistanceRatio = 0;
                s.params.slidesPerView = 1;
                s.params.slidesPerColumn = 1;
                s.params.slidesPerGroup = 1;
                s.params.centeredSlides = false;
                s.params.spaceBetween = 0;
                s.params.virtualTranslate = true;
                s.params.setWrapperSize = false
            }
            if (s.params.effect === "fade") {
                s.params.slidesPerView = 1;
                s.params.slidesPerColumn = 1;
                s.params.slidesPerGroup = 1;
                s.params.watchSlidesProgress = true;
                s.params.spaceBetween = 0;
                if (typeof initalVirtualTranslate === "undefined") {
                    s.params.virtualTranslate = true
                }
            }
            if (s.params.grabCursor && s.support.touch) {
                s.params.grabCursor = false
            }
            s.wrapper = s.container.children("." + s.params.wrapperClass);
            if (s.params.pagination) {
                s.paginationContainer = $(s.params.pagination);
                if (s.params.paginationClickable) {
                    s.paginationContainer.addClass("swiper-pagination-clickable")
                }
            }

            function isH() {
                return s.params.direction === "horizontal"
            }
            s.rtl = isH() && (s.container[0].dir.toLowerCase() === "rtl" || s.container.css("direction") === "rtl");
            if (s.rtl) {
                s.classNames.push("swiper-container-rtl")
            }
            if (s.rtl) {
                s.wrongRTL = s.wrapper.css("display") === "-webkit-box"
            }
            if (s.params.slidesPerColumn > 1) {
                s.classNames.push("swiper-container-multirow")
            }
            if (s.device.android) {
                s.classNames.push("swiper-container-android")
            }
            s.container.addClass(s.classNames.join(" "));
            s.translate = 0;
            s.progress = 0;
            s.velocity = 0;
            s.lockSwipeToNext = function() {
                s.params.allowSwipeToNext = false
            };
            s.lockSwipeToPrev = function() {
                s.params.allowSwipeToPrev = false
            };
            s.lockSwipes = function() {
                s.params.allowSwipeToNext = s.params.allowSwipeToPrev = false
            };
            s.unlockSwipeToNext = function() {
                s.params.allowSwipeToNext = true
            };
            s.unlockSwipeToPrev = function() {
                s.params.allowSwipeToPrev = true
            };
            s.unlockSwipes = function() {
                s.params.allowSwipeToNext = s.params.allowSwipeToPrev = true
            };
            if (s.params.grabCursor) {
                s.container[0].style.cursor = "move";
                s.container[0].style.cursor = "-webkit-grab";
                s.container[0].style.cursor = "-moz-grab";
                s.container[0].style.cursor = "grab"
            }
            s.imagesToLoad = [];
            s.imagesLoaded = 0;
            s.loadImage = function(imgElement, src, checkForComplete, callback) {
                var image;

                function onReady() {
                    if (callback) callback()
                }
                if (!imgElement.complete || !checkForComplete) {
                    if (src) {
                        image = new Image;
                        image.onload = onReady;
                        image.onerror = onReady;
                        image.src = src
                    } else {
                        onReady()
                    }
                } else {
                    onReady()
                }
            };
            s.preloadImages = function() {
                s.imagesToLoad = s.container.find("img");

                function _onReady() {
                    if (typeof s === "undefined" || s === null) return;
                    if (s.imagesLoaded !== undefined) s.imagesLoaded++;
                    if (s.imagesLoaded === s.imagesToLoad.length) {
                        if (s.params.updateOnImagesReady) s.update();
                        s.emit("onImagesReady", s)
                    }
                }
                for (var i = 0; i < s.imagesToLoad.length; i++) {
                    s.loadImage(s.imagesToLoad[i], s.imagesToLoad[i].currentSrc || s.imagesToLoad[i].getAttribute("src"), true, _onReady)
                }
            };
            s.autoplayTimeoutId = undefined;
            s.autoplaying = false;
            s.autoplayPaused = false;

            function autoplay() {
                s.autoplayTimeoutId = setTimeout(function() {
                    if (s.params.loop) {
                        s.fixLoop();
                        s._slideNext()
                    } else {
                        if (!s.isEnd) {
                            s._slideNext()
                        } else {
                            if (!params.autoplayStopOnLast) {
                                s._slideTo(0)
                            } else {
                                s.stopAutoplay()
                            }
                        }
                    }
                }, s.params.autoplay)
            }
            s.startAutoplay = function() {
                if (typeof s.autoplayTimeoutId !== "undefined") return false;
                if (!s.params.autoplay) return false;
                if (s.autoplaying) return false;
                s.autoplaying = true;
                s.emit("onAutoplayStart", s);
                autoplay()
            };
            s.stopAutoplay = function() {
                if (!s.autoplayTimeoutId) return;
                if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
                s.autoplaying = false;
                s.autoplayTimeoutId = undefined;
                s.emit("onAutoplayStop", s)
            };
            s.pauseAutoplay = function(speed) {
                if (s.autoplayPaused) return;
                if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
                s.autoplayPaused = true;
                if (speed === 0) {
                    s.autoplayPaused = false;
                    autoplay()
                } else {
                    s.wrapper.transitionEnd(function() {
                        s.autoplayPaused = false;
                        if (!s.autoplaying) {
                            s.stopAutoplay()
                        } else {
                            autoplay()
                        }
                    })
                }
            };
            s.minTranslate = function() {
                return -s.snapGrid[0]
            };
            s.maxTranslate = function() {
                return -s.snapGrid[s.snapGrid.length - 1]
            };
            s.updateContainerSize = function() {
                s.width = s.container[0].clientWidth;
                s.height = s.container[0].clientHeight;
                s.size = isH() ? s.width : s.height
            };
            s.updateSlidesSize = function() {
                s.slides = s.wrapper.children("." + s.params.slideClass);
                s.snapGrid = [];
                s.slidesGrid = [];
                s.slidesSizesGrid = [];
                var spaceBetween = s.params.spaceBetween,
                    slidePosition = 0,
                    i, prevSlideSize = 0,
                    index = 0;
                if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
                    spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * s.size
                }
                s.virtualSize = -spaceBetween;
                if (s.rtl) s.slides.css({
                    marginLeft: "",
                    marginTop: ""
                });
                else s.slides.css({
                    marginRight: "",
                    marginBottom: ""
                });
                var slidesNumberEvenToRows;
                if (s.params.slidesPerColumn > 1) {
                    if (Math.floor(s.slides.length / s.params.slidesPerColumn) === s.slides.length / s.params.slidesPerColumn) {
                        slidesNumberEvenToRows = s.slides.length
                    } else {
                        slidesNumberEvenToRows = Math.ceil(s.slides.length / s.params.slidesPerColumn) * s.params.slidesPerColumn
                    }
                }
                var slideSize;
                for (i = 0; i < s.slides.length; i++) {
                    slideSize = 0;
                    var slide = s.slides.eq(i);
                    if (s.params.slidesPerColumn > 1) {
                        var newSlideOrderIndex;
                        var column, row;
                        var slidesPerColumn = s.params.slidesPerColumn;
                        var slidesPerRow;
                        if (s.params.slidesPerColumnFill === "column") {
                            column = Math.floor(i / slidesPerColumn);
                            row = i - column * slidesPerColumn;
                            newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;
                            slide.css({
                                "-webkit-box-ordinal-group": newSlideOrderIndex,
                                "-moz-box-ordinal-group": newSlideOrderIndex,
                                "-ms-flex-order": newSlideOrderIndex,
                                "-webkit-order": newSlideOrderIndex,
                                order: newSlideOrderIndex
                            })
                        } else {
                            slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
                            row = Math.floor(i / slidesPerRow);
                            column = i - row * slidesPerRow
                        }
                        slide.css({
                            "margin-top": row !== 0 && s.params.spaceBetween && s.params.spaceBetween + "px"
                        }).attr("data-swiper-column", column).attr("data-swiper-row", row)
                    }
                    if (slide.css("display") === "none") continue;
                    if (s.params.slidesPerView === "auto") {
                        slideSize = isH() ? slide.outerWidth(true) : slide.outerHeight(true)
                    } else {
                        slideSize = (s.size - (s.params.slidesPerView - 1) * spaceBetween) / s.params.slidesPerView;
                        if (isH()) {
                            s.slides[i].style.width = slideSize + "px"
                        } else {
                            s.slides[i].style.height = slideSize + "px"
                        }
                    }
                    s.slides[i].swiperSlideSize = slideSize;
                    s.slidesSizesGrid.push(slideSize);
                    if (s.params.centeredSlides) {
                        slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                        if (i === 0) slidePosition = slidePosition - s.size / 2 - spaceBetween;
                        if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
                        if (index % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
                        s.slidesGrid.push(slidePosition)
                    } else {
                        if (index % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
                        s.slidesGrid.push(slidePosition);
                        slidePosition = slidePosition + slideSize + spaceBetween
                    }
                    s.virtualSize += slideSize + spaceBetween;
                    prevSlideSize = slideSize;
                    index++
                }
                s.virtualSize = Math.max(s.virtualSize, s.size);
                var newSlidesGrid;
                if (s.rtl && s.wrongRTL && (s.params.effect === "slide" || s.params.effect === "coverflow")) {
                    s.wrapper.css({
                        width: s.virtualSize + s.params.spaceBetween + "px"
                    })
                }
                if (!s.support.flexbox || s.params.setWrapperSize) {
                    if (isH()) s.wrapper.css({
                        width: s.virtualSize + s.params.spaceBetween + "px"
                    });
                    else s.wrapper.css({
                        height: s.virtualSize + s.params.spaceBetween + "px"
                    })
                }
                if (s.params.slidesPerColumn > 1) {
                    s.virtualSize = (slideSize + s.params.spaceBetween) * slidesNumberEvenToRows;
                    s.virtualSize = Math.ceil(s.virtualSize / s.params.slidesPerColumn) - s.params.spaceBetween;
                    s.wrapper.css({
                        width: s.virtualSize + s.params.spaceBetween + "px"
                    });
                    if (s.params.centeredSlides) {
                        newSlidesGrid = [];
                        for (i = 0; i < s.snapGrid.length; i++) {
                            if (s.snapGrid[i] < s.virtualSize + s.snapGrid[0]) newSlidesGrid.push(s.snapGrid[i])
                        }
                        s.snapGrid = newSlidesGrid
                    }
                }
                if (!s.params.centeredSlides) {
                    newSlidesGrid = [];
                    for (i = 0; i < s.snapGrid.length; i++) {
                        if (s.snapGrid[i] <= s.virtualSize - s.size) {
                            newSlidesGrid.push(s.snapGrid[i])
                        }
                    }
                    s.snapGrid = newSlidesGrid;
                    if (Math.floor(s.virtualSize - s.size) > Math.floor(s.snapGrid[s.snapGrid.length - 1])) {
                        s.snapGrid.push(s.virtualSize - s.size)
                    }
                }
                if (s.snapGrid.length === 0) s.snapGrid = [0];
                if (s.params.spaceBetween !== 0) {
                    if (isH()) {
                        if (s.rtl) s.slides.css({
                            marginLeft: spaceBetween + "px"
                        });
                        else s.slides.css({
                            marginRight: spaceBetween + "px"
                        })
                    } else s.slides.css({
                        marginBottom: spaceBetween + "px"
                    })
                }
                if (s.params.watchSlidesProgress) {
                    s.updateSlidesOffset()
                }
            };
            s.updateSlidesOffset = function() {
                for (var i = 0; i < s.slides.length; i++) {
                    s.slides[i].swiperSlideOffset = isH() ? s.slides[i].offsetLeft : s.slides[i].offsetTop
                }
            };
            s.updateSlidesProgress = function(translate) {
                if (typeof translate === "undefined") {
                    translate = s.translate || 0
                }
                if (s.slides.length === 0) return;
                if (typeof s.slides[0].swiperSlideOffset === "undefined") s.updateSlidesOffset();
                var offsetCenter = s.params.centeredSlides ? -translate + s.size / 2 : -translate;
                if (s.rtl) offsetCenter = s.params.centeredSlides ? translate - s.size / 2 : translate;
                s.slides.removeClass(s.params.slideVisibleClass);
                for (var i = 0; i < s.slides.length; i++) {
                    var slide = s.slides[i];
                    var slideCenterOffset = s.params.centeredSlides === true ? slide.swiperSlideSize / 2 : 0;
                    var slideProgress = (offsetCenter - slide.swiperSlideOffset - slideCenterOffset) / (slide.swiperSlideSize + s.params.spaceBetween);
                    if (s.params.watchSlidesVisibility) {
                        var slideBefore = -(offsetCenter - slide.swiperSlideOffset - slideCenterOffset);
                        var slideAfter = slideBefore + s.slidesSizesGrid[i];
                        var isVisible = slideBefore >= 0 && slideBefore < s.size || slideAfter > 0 && slideAfter <= s.size || slideBefore <= 0 && slideAfter >= s.size;
                        if (isVisible) {
                            s.slides.eq(i).addClass(s.params.slideVisibleClass)
                        }
                    }
                    slide.progress = s.rtl ? -slideProgress : slideProgress
                }
            };
            s.updateProgress = function(translate) {
                if (typeof translate === "undefined") {
                    translate = s.translate || 0
                }
                var translatesDiff = s.maxTranslate() - s.minTranslate();
                if (translatesDiff === 0) {
                    s.progress = 0;
                    s.isBeginning = s.isEnd = true
                } else {
                    s.progress = (translate - s.minTranslate()) / translatesDiff;
                    s.isBeginning = s.progress <= 0;
                    s.isEnd = s.progress >= 1
                }
                if (s.isBeginning) s.emit("onReachBeginning", s);
                if (s.isEnd) s.emit("onReachEnd", s);
                if (s.params.watchSlidesProgress) s.updateSlidesProgress(translate);
                s.emit("onProgress", s, s.progress)
            };
            s.updateActiveIndex = function() {
                var translate = s.rtl ? s.translate : -s.translate;
                var newActiveIndex, i, snapIndex;
                for (i = 0; i < s.slidesGrid.length; i++) {
                    if (typeof s.slidesGrid[i + 1] !== "undefined") {
                        if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1] - (s.slidesGrid[i + 1] - s.slidesGrid[i]) / 2) {
                            newActiveIndex = i
                        } else if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1]) {
                            newActiveIndex = i + 1
                        }
                    } else {
                        if (translate >= s.slidesGrid[i]) {
                            newActiveIndex = i
                        }
                    }
                }
                if (newActiveIndex < 0 || typeof newActiveIndex === "undefined") newActiveIndex = 0;
                snapIndex = Math.floor(newActiveIndex / s.params.slidesPerGroup);
                if (snapIndex >= s.snapGrid.length) snapIndex = s.snapGrid.length - 1;
                if (newActiveIndex === s.activeIndex) {
                    return
                }
                s.snapIndex = snapIndex;
                s.previousIndex = s.activeIndex;
                s.activeIndex = newActiveIndex;
                s.updateClasses()
            };
            s.updateClasses = function() {
                s.slides.removeClass(s.params.slideActiveClass + " " + s.params.slideNextClass + " " + s.params.slidePrevClass);
                var activeSlide = s.slides.eq(s.activeIndex);
                activeSlide.addClass(s.params.slideActiveClass);
                activeSlide.next("." + s.params.slideClass).addClass(s.params.slideNextClass);
                activeSlide.prev("." + s.params.slideClass).addClass(s.params.slidePrevClass);
                if (s.bullets && s.bullets.length > 0) {
                    s.bullets.removeClass(s.params.bulletActiveClass);
                    var bulletIndex;
                    if (s.params.loop) {
                        bulletIndex = Math.ceil(s.activeIndex - s.loopedSlides) / s.params.slidesPerGroup;
                        if (bulletIndex > s.slides.length - 1 - s.loopedSlides * 2) {
                            bulletIndex = bulletIndex - (s.slides.length - s.loopedSlides * 2)
                        }
                        if (bulletIndex > s.bullets.length - 1) bulletIndex = bulletIndex - s.bullets.length
                    } else {
                        if (typeof s.snapIndex !== "undefined") {
                            bulletIndex = s.snapIndex
                        } else {
                            bulletIndex = s.activeIndex || 0
                        }
                    }
                    if (s.paginationContainer.length > 1) {
                        s.bullets.each(function() {
                            if ($(this).index() === bulletIndex) $(this).addClass(s.params.bulletActiveClass)
                        })
                    } else {
                        s.bullets.eq(bulletIndex).addClass(s.params.bulletActiveClass)
                    }
                }
                if (!s.params.loop) {
                    if (s.params.prevButton) {
                        if (s.isBeginning) {
                            $(s.params.prevButton).addClass(s.params.buttonDisabledClass);
                            if (s.params.a11y && s.a11y) s.a11y.disable($(s.params.prevButton))
                        } else {
                            $(s.params.prevButton).removeClass(s.params.buttonDisabledClass);
                            if (s.params.a11y && s.a11y) s.a11y.enable($(s.params.prevButton))
                        }
                    }
                    if (s.params.nextButton) {
                        if (s.isEnd) {
                            $(s.params.nextButton).addClass(s.params.buttonDisabledClass);
                            if (s.params.a11y && s.a11y) s.a11y.disable($(s.params.nextButton))
                        } else {
                            $(s.params.nextButton).removeClass(s.params.buttonDisabledClass);
                            if (s.params.a11y && s.a11y) s.a11y.enable($(s.params.nextButton))
                        }
                    }
                }
            };
            s.updatePagination = function() {
                if (!s.params.pagination) return;
                if (s.paginationContainer && s.paginationContainer.length > 0) {
                    var bulletsHTML = "";
                    var numberOfBullets = s.params.loop ? Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup) : s.snapGrid.length;
                    for (var i = 0; i < numberOfBullets; i++) {
                        if (s.params.paginationBulletRender) {
                            bulletsHTML += s.params.paginationBulletRender(i, s.params.bulletClass)
                        } else {
                            bulletsHTML += '<span class="' + s.params.bulletClass + '"></span>'
                        }
                    }
                    s.paginationContainer.html(bulletsHTML);
                    s.bullets = s.paginationContainer.find("." + s.params.bulletClass)
                }
            };
            s.update = function(updateTranslate) {
                s.updateContainerSize();
                s.updateSlidesSize();
                s.updateProgress();
                s.updatePagination();
                s.updateClasses();
                if (s.params.scrollbar && s.scrollbar) {
                    s.scrollbar.set()
                }

                function forceSetTranslate() {
                    newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
                    s.setWrapperTranslate(newTranslate);
                    s.updateActiveIndex();
                    s.updateClasses()
                }
                if (updateTranslate) {
                    var translated, newTranslate;
                    if (s.params.freeMode) {
                        forceSetTranslate()
                    } else {
                        if (s.params.slidesPerView === "auto" && s.isEnd && !s.params.centeredSlides) {
                            translated = s.slideTo(s.slides.length - 1, 0, false, true)
                        } else {
                            translated = s.slideTo(s.activeIndex, 0, false, true)
                        }
                        if (!translated) {
                            forceSetTranslate()
                        }
                    }
                }
            };
            s.onResize = function() {
                s.updateContainerSize();
                s.updateSlidesSize();
                s.updateProgress();
                if (s.params.slidesPerView === "auto" || s.params.freeMode) s.updatePagination();
                if (s.params.scrollbar && s.scrollbar) {
                    s.scrollbar.set()
                }
                if (s.params.freeMode) {
                    var newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
                    s.setWrapperTranslate(newTranslate);
                    s.updateActiveIndex();
                    s.updateClasses()
                } else {
                    s.updateClasses();
                    if (s.params.slidesPerView === "auto" && s.isEnd && !s.params.centeredSlides) {
                        s.slideTo(s.slides.length - 1, 0, false, true)
                    } else {
                        s.slideTo(s.activeIndex, 0, false, true)
                    }
                }
            };
            var desktopEvents = ["mousedown", "mousemove", "mouseup"];
            if (window.navigator.pointerEnabled) desktopEvents = ["pointerdown", "pointermove", "pointerup"];
            else if (window.navigator.msPointerEnabled) desktopEvents = ["MSPointerDown", "MSPointerMove", "MSPointerUp"];
            s.touchEvents = {
                start: s.support.touch || !s.params.simulateTouch ? "touchstart" : desktopEvents[0],
                move: s.support.touch || !s.params.simulateTouch ? "touchmove" : desktopEvents[1],
                end: s.support.touch || !s.params.simulateTouch ? "touchend" : desktopEvents[2]
            };
            if (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) {
                (s.params.touchEventsTarget === "container" ? s.container : s.wrapper).addClass("swiper-wp8-" + s.params.direction)
            }
            s.initEvents = function(detach) {
                var actionDom = detach ? "off" : "on";
                var action = detach ? "removeEventListener" : "addEventListener";
                var touchEventsTarget = s.params.touchEventsTarget === "container" ? s.container[0] : s.wrapper[0];
                var target = s.support.touch ? touchEventsTarget : document;
                var moveCapture = s.params.nested ? true : false;
                if (s.browser.ie) {
                    touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, false);
                    target[action](s.touchEvents.move, s.onTouchMove, moveCapture);
                    target[action](s.touchEvents.end, s.onTouchEnd, false)
                } else {
                    if (s.support.touch) {
                        touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, false);
                        touchEventsTarget[action](s.touchEvents.move, s.onTouchMove, moveCapture);
                        touchEventsTarget[action](s.touchEvents.end, s.onTouchEnd, false)
                    }
                    if (params.simulateTouch && !s.device.ios && !s.device.android) {
                        touchEventsTarget[action]("mousedown", s.onTouchStart, false);
                        target[action]("mousemove", s.onTouchMove, moveCapture);
                        target[action]("mouseup", s.onTouchEnd, false)
                    }
                }
                window[action]("resize", s.onResize);
                if (s.params.nextButton) {
                    $(s.params.nextButton)[actionDom]("click", s.onClickNext);
                    if (s.params.a11y && s.a11y) $(s.params.nextButton)[actionDom]("keydown", s.a11y.onEnterKey)
                }
                if (s.params.prevButton) {
                    $(s.params.prevButton)[actionDom]("click", s.onClickPrev);
                    if (s.params.a11y && s.a11y) $(s.params.prevButton)[actionDom]("keydown", s.a11y.onEnterKey)
                }
                if (s.params.pagination && s.params.paginationClickable) {
                    $(s.paginationContainer)[actionDom]("click", "." + s.params.bulletClass, s.onClickIndex)
                }
                if (s.params.preventClicks || s.params.preventClicksPropagation) touchEventsTarget[action]("click", s.preventClicks, true)
            };
            s.attachEvents = function() {
                s.initEvents()
            };
            s.detachEvents = function() {
                s.initEvents(true)
            };
            s.allowClick = true;
            s.preventClicks = function(e) {
                if (!s.allowClick) {
                    if (s.params.preventClicks) e.preventDefault();
                    if (s.params.preventClicksPropagation) {
                        e.stopPropagation();
                        e.stopImmediatePropagation()
                    }
                }
            };
            s.onClickNext = function(e) {
                e.preventDefault();
                s.slideNext()
            };
            s.onClickPrev = function(e) {
                e.preventDefault();
                s.slidePrev()
            };
            s.onClickIndex = function(e) {
                e.preventDefault();
                var index = $(this).index() * s.params.slidesPerGroup;
                if (s.params.loop) index = index + s.loopedSlides;
                s.slideTo(index)
            };

            function findElementInEvent(e, selector) {
                var el = $(e.target);
                if (!el.is(selector)) {
                    if (typeof selector === "string") {
                        el = el.parents(selector)
                    } else if (selector.nodeType) {
                        var found;
                        el.parents().each(function(index, _el) {
                            if (_el === selector) found = selector
                        });
                        if (!found) return undefined;
                        else return selector
                    }
                }
                if (el.length === 0) {
                    return undefined
                }
                return el[0]
            }
            s.updateClickedSlide = function(e) {
                var slide = findElementInEvent(e, "." + s.params.slideClass);
                if (slide) {
                    s.clickedSlide = slide;
                    s.clickedIndex = $(slide).index()
                } else {
                    s.clickedSlide = undefined;
                    s.clickedIndex = undefined;
                    return
                }
                if (s.params.slideToClickedSlide && s.clickedIndex !== undefined && s.clickedIndex !== s.activeIndex) {
                    var slideToIndex = s.clickedIndex,
                        realIndex;
                    if (s.params.loop) {
                        realIndex = $(s.clickedSlide).attr("data-swiper-slide-index");
                        if (slideToIndex > s.slides.length - s.params.slidesPerView) {
                            s.fixLoop();
                            slideToIndex = s.wrapper.children("." + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]').eq(0).index();
                            setTimeout(function() {
                                s.slideTo(slideToIndex)
                            }, 0)
                        } else if (slideToIndex < s.params.slidesPerView - 1) {
                            s.fixLoop();
                            var duplicatedSlides = s.wrapper.children("." + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]');
                            slideToIndex = duplicatedSlides.eq(duplicatedSlides.length - 1).index();
                            setTimeout(function() {
                                s.slideTo(slideToIndex)
                            }, 0)
                        } else {
                            s.slideTo(slideToIndex)
                        }
                    } else {
                        s.slideTo(slideToIndex)
                    }
                }
            };
            var isTouched, isMoved, touchStartTime, isScrolling, currentTranslate, startTranslate, allowThresholdMove, formElements = "input, select, textarea, button",
                lastClickTime = Date.now(),
                clickTimeout, velocities = [],
                allowMomentumBounce;
            s.animating = false;
            s.touches = {
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
                diff: 0
            };
            var isTouchEvent, startMoving;
            s.onTouchStart = function(e) {
                if (e.originalEvent) e = e.originalEvent;
                isTouchEvent = e.type === "touchstart";
                if (!isTouchEvent && "which" in e && e.which === 3) return;
                if (s.params.noSwiping && findElementInEvent(e, "." + s.params.noSwipingClass)) {
                    s.allowClick = true;
                    return
                }
                if (s.params.swipeHandler) {
                    if (!findElementInEvent(e, s.params.swipeHandler)) return
                }
                isTouched = true;
                isMoved = false;
                isScrolling = undefined;
                startMoving = undefined;
                s.touches.startX = s.touches.currentX = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX;
                s.touches.startY = s.touches.currentY = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY;
                touchStartTime = Date.now();
                s.allowClick = true;
                s.updateContainerSize();
                s.swipeDirection = undefined;
                if (s.params.threshold > 0) allowThresholdMove = false;
                if (e.type !== "touchstart") {
                    var preventDefault = true;
                    if ($(e.target).is(formElements)) preventDefault = false;
                    if (document.activeElement && $(document.activeElement).is(formElements)) {
                        document.activeElement.blur()
                    }
                    if (preventDefault) {
                        e.preventDefault()
                    }
                }
                s.emit("onTouchStart", s, e)
            };
            s.onTouchMove = function(e) {
                if (e.originalEvent) e = e.originalEvent;
                if (isTouchEvent && e.type === "mousemove") return;
                if (e.preventedByNestedSwiper) return;
                if (s.params.onlyExternal) {
                    isMoved = true;
                    s.allowClick = false;
                    return
                }
                if (isTouchEvent && document.activeElement) {
                    if (e.target === document.activeElement && $(e.target).is(formElements)) {
                        isMoved = true;
                        s.allowClick = false;
                        return
                    }
                }
                s.emit("onTouchMove", s, e);
                if (e.targetTouches && e.targetTouches.length > 1) return;
                s.touches.currentX = e.type === "touchmove" ? e.targetTouches[0].pageX : e.pageX;
                s.touches.currentY = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY;
                if (typeof isScrolling === "undefined") {
                    var touchAngle = Math.atan2(Math.abs(s.touches.currentY - s.touches.startY), Math.abs(s.touches.currentX - s.touches.startX)) * 180 / Math.PI;
                    isScrolling = isH() ? touchAngle > s.params.touchAngle : 90 - touchAngle > s.params.touchAngle
                }
                if (isScrolling) {
                    s.emit("onTouchMoveOpposite", s, e)
                }
                if (typeof startMoving === "undefined" && s.browser.ieTouch) {
                    if (s.touches.currentX !== s.touches.startX || s.touches.currentY !== s.touches.startY) {
                        startMoving = true
                    }
                }
                if (!isTouched) return;
                if (isScrolling) {
                    isTouched = false;
                    return
                }
                if (!startMoving && s.browser.ieTouch) {
                    return
                }
                s.allowClick = false;
                s.emit("onSliderMove", s, e);
                e.preventDefault();
                if (s.params.touchMoveStopPropagation && !s.params.nested) {
                    e.stopPropagation()
                }
                if (!isMoved) {
                    if (params.loop) {
                        s.fixLoop()
                    }
                    startTranslate = s.getWrapperTranslate();
                    s.setWrapperTransition(0);
                    if (s.animating) {
                        s.wrapper.trigger("webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd")
                    }
                    if (s.params.autoplay && s.autoplaying) {
                        if (s.params.autoplayDisableOnInteraction) {
                            s.stopAutoplay()
                        } else {
                            s.pauseAutoplay()
                        }
                    }
                    allowMomentumBounce = false;
                    if (s.params.grabCursor) {
                        s.container[0].style.cursor = "move";
                        s.container[0].style.cursor = "-webkit-grabbing";
                        s.container[0].style.cursor = "-moz-grabbin";
                        s.container[0].style.cursor = "grabbing"
                    }
                }
                isMoved = true;
                var diff = s.touches.diff = isH() ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;
                diff = diff * s.params.touchRatio;
                if (s.rtl) diff = -diff;
                s.swipeDirection = diff > 0 ? "prev" : "next";
                currentTranslate = diff + startTranslate;
                var disableParentSwiper = true;
                if (diff > 0 && currentTranslate > s.minTranslate()) {
                    disableParentSwiper = false;
                    if (s.params.resistance) currentTranslate = s.minTranslate() - 1 + Math.pow(-s.minTranslate() + startTranslate + diff, s.params.resistanceRatio)
                } else if (diff < 0 && currentTranslate < s.maxTranslate()) {
                    disableParentSwiper = false;
                    if (s.params.resistance) currentTranslate = s.maxTranslate() + 1 - Math.pow(s.maxTranslate() - startTranslate - diff, s.params.resistanceRatio)
                }
                if (disableParentSwiper) {
                    e.preventedByNestedSwiper = true
                }
                if (!s.params.allowSwipeToNext && s.swipeDirection === "next" && currentTranslate < startTranslate) {
                    currentTranslate = startTranslate
                }
                if (!s.params.allowSwipeToPrev && s.swipeDirection === "prev" && currentTranslate > startTranslate) {
                    currentTranslate = startTranslate
                }
                if (!s.params.followFinger) return;
                if (s.params.threshold > 0) {
                    if (Math.abs(diff) > s.params.threshold || allowThresholdMove) {
                        if (!allowThresholdMove) {
                            allowThresholdMove = true;
                            s.touches.startX = s.touches.currentX;
                            s.touches.startY = s.touches.currentY;
                            currentTranslate = startTranslate;
                            s.touches.diff = isH() ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;
                            return
                        }
                    } else {
                        currentTranslate = startTranslate;
                        return
                    }
                }
                if (s.params.freeMode || s.params.watchSlidesProgress) {
                    s.updateActiveIndex()
                }
                if (s.params.freeMode) {
                    if (velocities.length === 0) {
                        velocities.push({
                            position: s.touches[isH() ? "startX" : "startY"],
                            time: touchStartTime
                        })
                    }
                    velocities.push({
                        position: s.touches[isH() ? "currentX" : "currentY"],
                        time: (new Date).getTime()
                    })
                }
                s.updateProgress(currentTranslate);
                s.setWrapperTranslate(currentTranslate)
            };
            s.onTouchEnd = function(e) {
                if (e.originalEvent) e = e.originalEvent;
                s.emit("onTouchEnd", s, e);
                if (!isTouched) return;
                if (s.params.grabCursor && isMoved && isTouched) {
                    s.container[0].style.cursor = "move";
                    s.container[0].style.cursor = "-webkit-grab";
                    s.container[0].style.cursor = "-moz-grab";
                    s.container[0].style.cursor = "grab"
                }
                var touchEndTime = Date.now();
                var timeDiff = touchEndTime - touchStartTime;
                if (s.allowClick) {
                    s.updateClickedSlide(e);
                    s.emit("onTap", s, e);
                    if (timeDiff < 300 && touchEndTime - lastClickTime > 300) {
                        if (clickTimeout) clearTimeout(clickTimeout);
                        clickTimeout = setTimeout(function() {
                            if (!s) return;
                            if (s.params.paginationHide && s.paginationContainer.length > 0 && !$(e.target).hasClass(s.params.bulletClass)) {
                                s.paginationContainer.toggleClass(s.params.paginationHiddenClass)
                            }
                            s.emit("onClick", s, e)
                        }, 300)
                    }
                    if (timeDiff < 300 && touchEndTime - lastClickTime < 300) {
                        if (clickTimeout) clearTimeout(clickTimeout);
                        s.emit("onDoubleTap", s, e)
                    }
                }
                lastClickTime = Date.now();
                setTimeout(function() {
                    if (s && s.allowClick) s.allowClick = true
                }, 0);
                if (!isTouched || !isMoved || !s.swipeDirection || s.touches.diff === 0 || currentTranslate === startTranslate) {
                    isTouched = isMoved = false;
                    return
                }
                isTouched = isMoved = false;
                var currentPos;
                if (s.params.followFinger) {
                    currentPos = s.rtl ? s.translate : -s.translate
                } else {
                    currentPos = -currentTranslate
                }
                if (s.params.freeMode) {
                    if (currentPos < -s.minTranslate()) {
                        s.slideTo(s.activeIndex);
                        return
                    } else if (currentPos > -s.maxTranslate()) {
                        s.slideTo(s.slides.length - 1);
                        return
                    }
                    if (s.params.freeModeMomentum) {
                        if (velocities.length > 1) {
                            var lastMoveEvent = velocities.pop(),
                                velocityEvent = velocities.pop();
                            var distance = lastMoveEvent.position - velocityEvent.position;
                            var time = lastMoveEvent.time - velocityEvent.time;
                            s.velocity = distance / time;
                            s.velocity = s.velocity / 2;
                            if (Math.abs(s.velocity) < .02) {
                                s.velocity = 0
                            }
                            if (time > 150 || (new Date).getTime() - lastMoveEvent.time > 300) {
                                s.velocity = 0
                            }
                        } else {
                            s.velocity = 0
                        }
                        velocities.length = 0;
                        var momentumDuration = 1e3 * s.params.freeModeMomentumRatio;
                        var momentumDistance = s.velocity * momentumDuration;
                        var newPosition = s.translate + momentumDistance;
                        if (s.rtl) newPosition = -newPosition;
                        var doBounce = false;
                        var afterBouncePosition;
                        var bounceAmount = Math.abs(s.velocity) * 20 * s.params.freeModeMomentumBounceRatio;
                        if (newPosition < s.maxTranslate()) {
                            if (s.params.freeModeMomentumBounce) {
                                if (newPosition + s.maxTranslate() < -bounceAmount) {
                                    newPosition = s.maxTranslate() - bounceAmount
                                }
                                afterBouncePosition = s.maxTranslate();
                                doBounce = true;
                                allowMomentumBounce = true
                            } else {
                                newPosition = s.maxTranslate()
                            }
                        }
                        if (newPosition > s.minTranslate()) {
                            if (s.params.freeModeMomentumBounce) {
                                if (newPosition - s.minTranslate() > bounceAmount) {
                                    newPosition = s.minTranslate() + bounceAmount
                                }
                                afterBouncePosition = s.minTranslate();
                                doBounce = true;
                                allowMomentumBounce = true
                            } else {
                                newPosition = s.minTranslate()
                            }
                        }
                        if (s.velocity !== 0) {
                            if (s.rtl) {
                                momentumDuration = Math.abs((-newPosition - s.translate) / s.velocity)
                            } else {
                                momentumDuration = Math.abs((newPosition - s.translate) / s.velocity)
                            }
                        }
                        if (s.params.freeModeMomentumBounce && doBounce) {
                            s.updateProgress(afterBouncePosition);
                            s.setWrapperTransition(momentumDuration);
                            s.setWrapperTranslate(newPosition);
                            s.onTransitionStart();
                            s.animating = true;
                            s.wrapper.transitionEnd(function() {
                                if (!allowMomentumBounce) return;
                                s.emit("onMomentumBounce", s);
                                s.setWrapperTransition(s.params.speed);
                                s.setWrapperTranslate(afterBouncePosition);
                                s.wrapper.transitionEnd(function() {
                                    s.onTransitionEnd()
                                })
                            })
                        } else if (s.velocity) {
                            s.updateProgress(newPosition);
                            s.setWrapperTransition(momentumDuration);
                            s.setWrapperTranslate(newPosition);
                            s.onTransitionStart();
                            if (!s.animating) {
                                s.animating = true;
                                s.wrapper.transitionEnd(function() {
                                    s.onTransitionEnd()
                                })
                            }
                        } else {
                            s.updateProgress(newPosition)
                        }
                        s.updateActiveIndex()
                    }
                    if (!s.params.freeModeMomentum || timeDiff >= s.params.longSwipesMs) {
                        s.updateProgress();
                        s.updateActiveIndex()
                    }
                    return
                }
                var i, stopIndex = 0,
                    groupSize = s.slidesSizesGrid[0];
                for (i = 0; i < s.slidesGrid.length; i += s.params.slidesPerGroup) {
                    if (typeof s.slidesGrid[i + s.params.slidesPerGroup] !== "undefined") {
                        if (currentPos >= s.slidesGrid[i] && currentPos < s.slidesGrid[i + s.params.slidesPerGroup]) {
                            stopIndex = i;
                            groupSize = s.slidesGrid[i + s.params.slidesPerGroup] - s.slidesGrid[i]
                        }
                    } else {
                        if (currentPos >= s.slidesGrid[i]) {
                            stopIndex = i;
                            groupSize = s.slidesGrid[s.slidesGrid.length - 1] - s.slidesGrid[s.slidesGrid.length - 2]
                        }
                    }
                }
                var ratio = (currentPos - s.slidesGrid[stopIndex]) / groupSize;
                if (timeDiff > s.params.longSwipesMs) {
                    if (!s.params.longSwipes) {
                        s.slideTo(s.activeIndex);
                        return
                    }
                    if (s.swipeDirection === "next") {
                        if (ratio >= s.params.longSwipesRatio) s.slideTo(stopIndex + s.params.slidesPerGroup);
                        else s.slideTo(stopIndex)
                    }
                    if (s.swipeDirection === "prev") {
                        if (ratio > 1 - s.params.longSwipesRatio) s.slideTo(stopIndex + s.params.slidesPerGroup);
                        else s.slideTo(stopIndex)
                    }
                } else {
                    if (!s.params.shortSwipes) {
                        s.slideTo(s.activeIndex);
                        return
                    }
                    if (s.swipeDirection === "next") {
                        s.slideTo(stopIndex + s.params.slidesPerGroup)
                    }
                    if (s.swipeDirection === "prev") {
                        s.slideTo(stopIndex)
                    }
                }
            };
            s._slideTo = function(slideIndex, speed) {
                return s.slideTo(slideIndex, speed, true, true)
            };
            s.slideTo = function(slideIndex, speed, runCallbacks, internal) {
                if (typeof runCallbacks === "undefined") runCallbacks = true;
                if (typeof slideIndex === "undefined") slideIndex = 0;
                if (slideIndex < 0) slideIndex = 0;
                s.snapIndex = Math.floor(slideIndex / s.params.slidesPerGroup);
                if (s.snapIndex >= s.snapGrid.length) s.snapIndex = s.snapGrid.length - 1;
                var translate = -s.snapGrid[s.snapIndex];
                if (s.params.autoplay && s.autoplaying) {
                    if (internal || !s.params.autoplayDisableOnInteraction) {
                        s.pauseAutoplay(speed)
                    } else {
                        s.stopAutoplay()
                    }
                }
                s.updateProgress(translate);
                for (var i = 0; i < s.slidesGrid.length; i++) {
                    if (-translate >= s.slidesGrid[i]) {
                        slideIndex = i
                    }
                }
                if (typeof speed === "undefined") speed = s.params.speed;
                s.previousIndex = s.activeIndex || 0;
                s.activeIndex = slideIndex;
                if (translate === s.translate) {
                    s.updateClasses();
                    return false
                }
                s.onTransitionStart(runCallbacks);
                if (speed === 0) {
                    s.setWrapperTransition(0);
                    s.setWrapperTranslate(translate);
                    s.onTransitionEnd(runCallbacks)
                } else {
                    s.setWrapperTransition(speed);
                    s.setWrapperTranslate(translate);
                    if (!s.animating) {
                        s.animating = true;
                        s.wrapper.transitionEnd(function() {
                            s.onTransitionEnd(runCallbacks)
                        })
                    }
                }
                s.updateClasses();
                return true
            };
            s.onTransitionStart = function(runCallbacks) {
                if (typeof runCallbacks === "undefined") runCallbacks = true;
                if (s.lazy) s.lazy.onTransitionStart();
                if (runCallbacks) {
                    s.emit("onTransitionStart", s);
                    if (s.activeIndex !== s.previousIndex) {
                        s.emit("onSlideChangeStart", s)
                    }
                }
            };
            s.onTransitionEnd = function(runCallbacks) {
                s.animating = false;
                s.setWrapperTransition(0);
                if (typeof runCallbacks === "undefined") runCallbacks = true;
                if (s.lazy) s.lazy.onTransitionEnd();
                if (runCallbacks) {
                    s.emit("onTransitionEnd", s);
                    if (s.activeIndex !== s.previousIndex) {
                        s.emit("onSlideChangeEnd", s)
                    }
                }
                if (s.params.hashnav && s.hashnav) {
                    s.hashnav.setHash()
                }
            };
            s.slideNext = function(runCallbacks, speed, internal) {
                if (s.params.loop) {
                    if (s.animating) return false;
                    s.fixLoop();
                    return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal)
                } else return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal)
            };
            s._slideNext = function(speed) {
                return s.slideNext(true, speed, true)
            };
            s.slidePrev = function(runCallbacks, speed, internal) {
                if (s.params.loop) {
                    if (s.animating) return false;
                    s.fixLoop();
                    return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal)
                } else return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal)
            };
            s._slidePrev = function(speed) {
                return s.slidePrev(true, speed, true)
            };
            s.slideReset = function(runCallbacks, speed) {
                return s.slideTo(s.activeIndex, speed, runCallbacks)
            };
            s.setWrapperTransition = function(duration, byController) {
                s.wrapper.transition(duration);
                if (s.params.effect !== "slide" && s.effects[s.params.effect]) {
                    s.effects[s.params.effect].setTransition(duration)
                }
                if (s.params.parallax && s.parallax) {
                    s.parallax.setTransition(duration)
                }
                if (s.params.scrollbar && s.scrollbar) {
                    s.scrollbar.setTransition(duration)
                }
                if (s.params.control && s.controller) {
                    s.controller.setTransition(duration, byController)
                }
                s.emit("onSetTransition", s, duration)
            };
            s.setWrapperTranslate = function(translate, updateActiveIndex, byController) {
                var x = 0,
                    y = 0,
                    z = 0;
                if (isH()) {
                    x = s.rtl ? -translate : translate
                } else {
                    y = translate
                }
                if (!s.params.virtualTranslate) {
                    if (s.support.transforms3d) s.wrapper.transform("translate3d(" + x + "px, " + y + "px, " + z + "px)");
                    else s.wrapper.transform("translate(" + x + "px, " + y + "px)")
                }
                s.translate = isH() ? x : y;
                if (updateActiveIndex) s.updateActiveIndex();
                if (s.params.effect !== "slide" && s.effects[s.params.effect]) {
                    s.effects[s.params.effect].setTranslate(s.translate)
                }
                if (s.params.parallax && s.parallax) {
                    s.parallax.setTranslate(s.translate)
                }
                if (s.params.scrollbar && s.scrollbar) {
                    s.scrollbar.setTranslate(s.translate)
                }
                if (s.params.control && s.controller) {
                    s.controller.setTranslate(s.translate, byController)
                }
                s.emit("onSetTranslate", s, s.translate)
            };
            s.getTranslate = function(el, axis) {
                var matrix, curTransform, curStyle, transformMatrix;
                if (typeof axis === "undefined") {
                    axis = "x"
                }
                if (s.params.virtualTranslate) {
                    return s.rtl ? -s.translate : s.translate
                }
                curStyle = window.getComputedStyle(el, null);
                if (window.WebKitCSSMatrix) {
                    transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === "none" ? "" : curStyle.webkitTransform)
                } else {
                    transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
                    matrix = transformMatrix.toString().split(",")
                }
                if (axis === "x") {
                    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41;
                    else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
                    else curTransform = parseFloat(matrix[4])
                }
                if (axis === "y") {
                    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42;
                    else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
                    else curTransform = parseFloat(matrix[5])
                }
                if (s.rtl && curTransform) curTransform = -curTransform;
                return curTransform || 0
            };
            s.getWrapperTranslate = function(axis) {
                if (typeof axis === "undefined") {
                    axis = isH() ? "x" : "y"
                }
                return s.getTranslate(s.wrapper[0], axis)
            };
            s.observers = [];

            function initObserver(target, options) {
                options = options || {};
                var ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
                var observer = new ObserverFunc(function(mutations) {
                    mutations.forEach(function(mutation) {
                        s.onResize();
                        s.emit("onObserverUpdate", s, mutation)
                    })
                });
                observer.observe(target, {
                    attributes: typeof options.attributes === "undefined" ? true : options.attributes,
                    childList: typeof options.childList === "undefined" ? true : options.childList,
                    characterData: typeof options.characterData === "undefined" ? true : options.characterData
                });
                s.observers.push(observer)
            }
            s.initObservers = function() {
                if (s.params.observeParents) {
                    var containerParents = s.container.parents();
                    for (var i = 0; i < containerParents.length; i++) {
                        initObserver(containerParents[i])
                    }
                }
                initObserver(s.container[0], {
                    childList: false
                });
                initObserver(s.wrapper[0], {
                    attributes: false
                })
            };
            s.disconnectObservers = function() {
                for (var i = 0; i < s.observers.length; i++) {
                    s.observers[i].disconnect()
                }
                s.observers = []
            };
            s.createLoop = function() {
                s.wrapper.children("." + s.params.slideClass + "." + s.params.slideDuplicateClass).remove();
                var slides = s.wrapper.children("." + s.params.slideClass);
                s.loopedSlides = parseInt(s.params.loopedSlides || s.params.slidesPerView, 10);
                s.loopedSlides = s.loopedSlides + s.params.loopAdditionalSlides;
                if (s.loopedSlides > slides.length) {
                    s.loopedSlides = slides.length
                }
                var prependSlides = [],
                    appendSlides = [],
                    i;
                slides.each(function(index, el) {
                    var slide = $(this);
                    if (index < s.loopedSlides) appendSlides.push(el);
                    if (index < slides.length && index >= slides.length - s.loopedSlides) prependSlides.push(el);
                    slide.attr("data-swiper-slide-index", index)
                });
                for (i = 0; i < appendSlides.length; i++) {
                    s.wrapper.append($(appendSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass))
                }
                for (i = prependSlides.length - 1; i >= 0; i--) {
                    s.wrapper.prepend($(prependSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass))
                }
            };
            s.destroyLoop = function() {
                s.wrapper.children("." + s.params.slideClass + "." + s.params.slideDuplicateClass).remove();
                s.slides.removeAttr("data-swiper-slide-index")
            };
            s.fixLoop = function() {
                var newIndex;
                if (s.activeIndex < s.loopedSlides) {
                    newIndex = s.slides.length - s.loopedSlides * 3 + s.activeIndex;
                    newIndex = newIndex + s.loopedSlides;
                    s.slideTo(newIndex, 0, false, true)
                } else if (s.params.slidesPerView === "auto" && s.activeIndex >= s.loopedSlides * 2 || s.activeIndex > s.slides.length - s.params.slidesPerView * 2) {
                    newIndex = -s.slides.length + s.activeIndex + s.loopedSlides;
                    newIndex = newIndex + s.loopedSlides;
                    s.slideTo(newIndex, 0, false, true)
                }
            };
            s.appendSlide = function(slides) {
                if (s.params.loop) {
                    s.destroyLoop()
                }
                if (typeof slides === "object" && slides.length) {
                    for (var i = 0; i < slides.length; i++) {
                        if (slides[i]) s.wrapper.append(slides[i])
                    }
                } else {
                    s.wrapper.append(slides)
                }
                if (s.params.loop) {
                    s.createLoop()
                }
                if (!(s.params.observer && s.support.observer)) {
                    s.update(true)
                }
            };
            s.prependSlide = function(slides) {
                if (s.params.loop) {
                    s.destroyLoop()
                }
                var newActiveIndex = s.activeIndex + 1;
                if (typeof slides === "object" && slides.length) {
                    for (var i = 0; i < slides.length; i++) {
                        if (slides[i]) s.wrapper.prepend(slides[i])
                    }
                    newActiveIndex = s.activeIndex + slides.length
                } else {
                    s.wrapper.prepend(slides)
                }
                if (s.params.loop) {
                    s.createLoop()
                }
                if (!(s.params.observer && s.support.observer)) {
                    s.update(true)
                }
                s.slideTo(newActiveIndex, 0, false)
            };
            s.removeSlide = function(slidesIndexes) {
                if (s.params.loop) {
                    s.destroyLoop()
                }
                var newActiveIndex = s.activeIndex,
                    indexToRemove;
                if (typeof slidesIndexes === "object" && slidesIndexes.length) {
                    for (var i = 0; i < slidesIndexes.length; i++) {
                        indexToRemove = slidesIndexes[i];
                        if (s.slides[indexToRemove]) s.slides.eq(indexToRemove).remove();
                        if (indexToRemove < newActiveIndex) newActiveIndex--
                    }
                    newActiveIndex = Math.max(newActiveIndex, 0)
                } else {
                    indexToRemove = slidesIndexes;
                    if (s.slides[indexToRemove]) s.slides.eq(indexToRemove).remove();
                    if (indexToRemove < newActiveIndex) newActiveIndex--;
                    newActiveIndex = Math.max(newActiveIndex, 0)
                }
                if (!(s.params.observer && s.support.observer)) {
                    s.update(true)
                }
                s.slideTo(newActiveIndex, 0, false)
            };
            s.removeAllSlides = function() {
                var slidesIndexes = [];
                for (var i = 0; i < s.slides.length; i++) {
                    slidesIndexes.push(i)
                }
                s.removeSlide(slidesIndexes)
            };
            s.effects = {
                fade: {
                    fadeIndex: null,
                    setTranslate: function() {
                        for (var i = 0; i < s.slides.length; i++) {
                            var slide = s.slides.eq(i);
                            var offset = slide[0].swiperSlideOffset;
                            var tx = -offset;
                            if (!s.params.virtualTranslate) tx = tx - s.translate;
                            var ty = 0;
                            if (!isH()) {
                                ty = tx;
                                tx = 0
                            }
                            var slideOpacity = s.params.fade.crossFade ? Math.max(1 - Math.abs(slide[0].progress), 0) : 1 + Math.min(Math.max(slide[0].progress, -1), 0);
                            if (slideOpacity > 0 && slideOpacity < 1) {
                                s.effects.fade.fadeIndex = i
                            }
                            slide.css({
                                opacity: slideOpacity
                            }).transform("translate3d(" + tx + "px, " + ty + "px, 0px)")
                        }
                    },
                    setTransition: function(duration) {
                        s.slides.transition(duration);
                        if (s.params.virtualTranslate && duration !== 0) {
                            var fadeIndex = s.effects.fade.fadeIndex !== null ? s.effects.fade.fadeIndex : s.activeIndex;
                            s.slides.eq(fadeIndex).transitionEnd(function() {
                                var triggerEvents = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"];
                                for (var i = 0; i < triggerEvents.length; i++) {
                                    s.wrapper.trigger(triggerEvents[i])
                                }
                            })
                        }
                    }
                },
                cube: {
                    setTranslate: function() {
                        var wrapperRotate = 0,
                            cubeShadow;
                        if (s.params.cube.shadow) {
                            if (isH()) {
                                cubeShadow = s.wrapper.find(".swiper-cube-shadow");
                                if (cubeShadow.length === 0) {
                                    cubeShadow = $('<div class="swiper-cube-shadow"></div>');
                                    s.wrapper.append(cubeShadow)
                                }
                                cubeShadow.css({
                                    height: s.width + "px"
                                })
                            } else {
                                cubeShadow = s.container.find(".swiper-cube-shadow");
                                if (cubeShadow.length === 0) {
                                    cubeShadow = $('<div class="swiper-cube-shadow"></div>');
                                    s.container.append(cubeShadow)
                                }
                            }
                        }
                        for (var i = 0; i < s.slides.length; i++) {
                            var slide = s.slides.eq(i);
                            var slideAngle = i * 90;
                            var round = Math.floor(slideAngle / 360);
                            if (s.rtl) {
                                slideAngle = -slideAngle;
                                round = Math.floor(-slideAngle / 360)
                            }
                            var progress = Math.max(Math.min(slide[0].progress, 1), -1);
                            var tx = 0,
                                ty = 0,
                                tz = 0;
                            if (i % 4 === 0) {
                                tx = -round * 4 * s.size;
                                tz = 0
                            } else if ((i - 1) % 4 === 0) {
                                tx = 0;
                                tz = -round * 4 * s.size
                            } else if ((i - 2) % 4 === 0) {
                                tx = s.size + round * 4 * s.size;
                                tz = s.size
                            } else if ((i - 3) % 4 === 0) {
                                tx = -s.size;
                                tz = 3 * s.size + s.size * 4 * round
                            }
                            if (s.rtl) {
                                tx = -tx
                            }
                            if (!isH()) {
                                ty = tx;
                                tx = 0
                            }
                            var transform = "rotateX(" + (isH() ? 0 : -slideAngle) + "deg) rotateY(" + (isH() ? slideAngle : 0) + "deg) translate3d(" + tx + "px, " + ty + "px, " + tz + "px)";
                            if (progress <= 1 && progress > -1) {
                                wrapperRotate = i * 90 + progress * 90;
                                if (s.rtl) wrapperRotate = -i * 90 - progress * 90
                            }
                            slide.transform(transform);
                            if (s.params.cube.slideShadows) {
                                var shadowBefore = isH() ? slide.find(".swiper-slide-shadow-left") : slide.find(".swiper-slide-shadow-top");
                                var shadowAfter = isH() ? slide.find(".swiper-slide-shadow-right") : slide.find(".swiper-slide-shadow-bottom");
                                if (shadowBefore.length === 0) {
                                    shadowBefore = $('<div class="swiper-slide-shadow-' + (isH() ? "left" : "top") + '"></div>');
                                    slide.append(shadowBefore)
                                }
                                if (shadowAfter.length === 0) {
                                    shadowAfter = $('<div class="swiper-slide-shadow-' + (isH() ? "right" : "bottom") + '"></div>');
                                    slide.append(shadowAfter)
                                }
                                if (shadowBefore.length) shadowBefore[0].style.opacity = -slide[0].progress;
                                if (shadowAfter.length) shadowAfter[0].style.opacity = slide[0].progress
                            }
                        }
                        s.wrapper.css({
                            "-webkit-transform-origin": "50% 50% -" + s.size / 2 + "px",
                            "-moz-transform-origin": "50% 50% -" + s.size / 2 + "px",
                            "-ms-transform-origin": "50% 50% -" + s.size / 2 + "px",
                            "transform-origin": "50% 50% -" + s.size / 2 + "px"
                        });
                        if (s.params.cube.shadow) {
                            if (isH()) {
                                cubeShadow.transform("translate3d(0px, " + (s.width / 2 + s.params.cube.shadowOffset) + "px, " + -s.width / 2 + "px) rotateX(90deg) rotateZ(0deg) scale(" + s.params.cube.shadowScale + ")")
                            } else {
                                var shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
                                var multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
                                var scale1 = s.params.cube.shadowScale,
                                    scale2 = s.params.cube.shadowScale / multiplier,
                                    offset = s.params.cube.shadowOffset;
                                cubeShadow.transform("scale3d(" + scale1 + ", 1, " + scale2 + ") translate3d(0px, " + (s.height / 2 + offset) + "px, " + -s.height / 2 / scale2 + "px) rotateX(-90deg)")
                            }
                        }
                        var zFactor = s.isSafari || s.isUiWebView ? -s.size / 2 : 0;
                        s.wrapper.transform("translate3d(0px,0," + zFactor + "px) rotateX(" + (isH() ? 0 : wrapperRotate) + "deg) rotateY(" + (isH() ? -wrapperRotate : 0) + "deg)")
                    },
                    setTransition: function(duration) {
                        s.slides.transition(duration).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(duration);
                        if (s.params.cube.shadow && !isH()) {
                            s.container.find(".swiper-cube-shadow").transition(duration)
                        }
                    }
                },
                coverflow: {
                    setTranslate: function() {
                        var transform = s.translate;
                        var center = isH() ? -transform + s.width / 2 : -transform + s.height / 2;
                        var rotate = isH() ? s.params.coverflow.rotate : -s.params.coverflow.rotate;
                        var translate = s.params.coverflow.depth;
                        for (var i = 0, length = s.slides.length; i < length; i++) {
                            var slide = s.slides.eq(i);
                            var slideSize = s.slidesSizesGrid[i];
                            var slideOffset = slide[0].swiperSlideOffset;
                            var offsetMultiplier = (center - slideOffset - slideSize / 2) / slideSize * s.params.coverflow.modifier;
                            var rotateY = isH() ? rotate * offsetMultiplier : 0;
                            var rotateX = isH() ? 0 : rotate * offsetMultiplier;
                            var translateZ = -translate * Math.abs(offsetMultiplier);
                            var translateY = isH() ? 0 : s.params.coverflow.stretch * offsetMultiplier;
                            var translateX = isH() ? s.params.coverflow.stretch * offsetMultiplier : 0;
                            if (Math.abs(translateX) < .001) translateX = 0;
                            if (Math.abs(translateY) < .001) translateY = 0;
                            if (Math.abs(translateZ) < .001) translateZ = 0;
                            if (Math.abs(rotateY) < .001) rotateY = 0;
                            if (Math.abs(rotateX) < .001) rotateX = 0;
                            var slideTransform = "translate3d(" + translateX + "px," + translateY + "px," + translateZ + "px)  rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
                            slide.transform(slideTransform);
                            slide[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
                            if (s.params.coverflow.slideShadows) {
                                var shadowBefore = isH() ? slide.find(".swiper-slide-shadow-left") : slide.find(".swiper-slide-shadow-top");
                                var shadowAfter = isH() ? slide.find(".swiper-slide-shadow-right") : slide.find(".swiper-slide-shadow-bottom");
                                if (shadowBefore.length === 0) {
                                    shadowBefore = $('<div class="swiper-slide-shadow-' + (isH() ? "left" : "top") + '"></div>');
                                    slide.append(shadowBefore)
                                }
                                if (shadowAfter.length === 0) {
                                    shadowAfter = $('<div class="swiper-slide-shadow-' + (isH() ? "right" : "bottom") + '"></div>');
                                    slide.append(shadowAfter)
                                }
                                if (shadowBefore.length) shadowBefore[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
                                if (shadowAfter.length) shadowAfter[0].style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0
                            }
                        }
                        if (s.browser.ie) {
                            var ws = s.wrapper[0].style;
                            ws.perspectiveOrigin = center + "px 50%"
                        }
                    },
                    setTransition: function(duration) {
                        s.slides.transition(duration).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(duration)
                    }
                }
            };
            s.lazy = {
                initialImageLoaded: false,
                loadImageInSlide: function(index) {
                    if (typeof index === "undefined") return;
                    if (s.slides.length === 0) return;
                    var slide = s.slides.eq(index);
                    var img = slide.find("img.swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)");
                    if (img.length === 0) return;
                    img.each(function() {
                        var _img = $(this);
                        _img.addClass("swiper-lazy-loading");
                        var src = _img.attr("data-src");
                        s.loadImage(_img[0], src, false, function() {
                            _img.attr("src", src);
                            _img.removeAttr("data-src");
                            _img.addClass("swiper-lazy-loaded").removeClass("swiper-lazy-loading");
                            slide.find(".swiper-lazy-preloader, .preloader").remove();
                            s.emit("onLazyImageReady", s, slide[0], _img[0])
                        });
                        s.emit("onLazyImageLoad", s, slide[0], _img[0])
                    })
                },
                load: function() {
                    if (s.params.watchSlidesVisibility) {
                        s.wrapper.children("." + s.params.slideVisibleClass).each(function() {
                            s.lazy.loadImageInSlide($(this).index())
                        })
                    } else {
                        if (s.params.slidesPerView > 1) {
                            for (var i = s.activeIndex; i < s.activeIndex + s.params.slidesPerView; i++) {
                                if (s.slides[i]) s.lazy.loadImageInSlide(i)
                            }
                        } else {
                            s.lazy.loadImageInSlide(s.activeIndex)
                        }
                    }
                    if (s.params.lazyLoadingInPrevNext) {
                        var nextSlide = s.wrapper.children("." + s.params.slideNextClass);
                        if (nextSlide.length > 0) s.lazy.loadImageInSlide(nextSlide.index());
                        var prevSlide = s.wrapper.children("." + s.params.slidePrevClass);
                        if (prevSlide.length > 0) s.lazy.loadImageInSlide(prevSlide.index())
                    }
                },
                onTransitionStart: function() {
                    if (s.params.lazyLoading) {
                        if (s.params.lazyLoadingOnTransitionStart || !s.params.lazyLoadingOnTransitionStart && !s.lazy.initialImageLoaded) {
                            s.lazy.initialImageLoaded = true;
                            s.lazy.load()
                        }
                    }
                },
                onTransitionEnd: function() {
                    if (s.params.lazyLoading && !s.params.lazyLoadingOnTransitionStart) {
                        s.lazy.load()
                    }
                }
            };
            s.scrollbar = {
                set: function() {
                    if (!s.params.scrollbar) return;
                    var sb = s.scrollbar;
                    sb.track = $(s.params.scrollbar);
                    sb.drag = sb.track.find(".swiper-scrollbar-drag");
                    if (sb.drag.length === 0) {
                        sb.drag = $('<div class="swiper-scrollbar-drag"></div>');
                        sb.track.append(sb.drag)
                    }
                    sb.drag[0].style.width = "";
                    sb.drag[0].style.height = "";
                    sb.trackSize = isH() ? sb.track[0].offsetWidth : sb.track[0].offsetHeight;
                    sb.divider = s.size / s.virtualSize;
                    sb.moveDivider = sb.divider * (sb.trackSize / s.size);
                    sb.dragSize = sb.trackSize * sb.divider;
                    if (isH()) {
                        sb.drag[0].style.width = sb.dragSize + "px"
                    } else {
                        sb.drag[0].style.height = sb.dragSize + "px"
                    }
                    if (sb.divider >= 1) {
                        sb.track[0].style.display = "none"
                    } else {
                        sb.track[0].style.display = ""
                    }
                    if (s.params.scrollbarHide) {
                        sb.track[0].style.opacity = 0
                    }
                },
                setTranslate: function() {
                    if (!s.params.scrollbar) return;
                    var sb = s.scrollbar;
                    var newPos;
                    var newSize = sb.dragSize;
                    newPos = (sb.trackSize - sb.dragSize) * s.progress;
                    if (s.rtl && isH()) {
                        newPos = -newPos;
                        if (newPos > 0) {
                            newSize = sb.dragSize - newPos;
                            newPos = 0
                        } else if (-newPos + sb.dragSize > sb.trackSize) {
                            newSize = sb.trackSize + newPos
                        }
                    } else {
                        if (newPos < 0) {
                            newSize = sb.dragSize + newPos;
                            newPos = 0
                        } else if (newPos + sb.dragSize > sb.trackSize) {
                            newSize = sb.trackSize - newPos
                        }
                    }
                    if (isH()) {
                        if (s.support.transforms3d) {
                            sb.drag.transform("translate3d(" + newPos + "px, 0, 0)")
                        } else {
                            sb.drag.transform("translateX(" + newPos + "px)")
                        }
                        sb.drag[0].style.width = newSize + "px"
                    } else {
                        if (s.support.transforms3d) {
                            sb.drag.transform("translate3d(0px, " + newPos + "px, 0)")
                        } else {
                            sb.drag.transform("translateY(" + newPos + "px)")
                        }
                        sb.drag[0].style.height = newSize + "px"
                    }
                    if (s.params.scrollbarHide) {
                        clearTimeout(sb.timeout);
                        sb.track[0].style.opacity = 1;
                        sb.timeout = setTimeout(function() {
                            sb.track[0].style.opacity = 0;
                            sb.track.transition(400)
                        }, 1e3)
                    }
                },
                setTransition: function(duration) {
                    if (!s.params.scrollbar) return;
                    s.scrollbar.drag.transition(duration)
                }
            };
            s.controller = {
                setTranslate: function(translate, byController) {
                    var controlled = s.params.control;
                    var multiplier, controlledTranslate;
                    if (s.isArray(controlled)) {
                        for (var i = 0; i < controlled.length; i++) {
                            if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
                                translate = controlled[i].rtl && controlled[i].params.direction === "horizontal" ? -s.translate : s.translate;
                                multiplier = (controlled[i].maxTranslate() - controlled[i].minTranslate()) / (s.maxTranslate() - s.minTranslate());
                                controlledTranslate = (translate - s.minTranslate()) * multiplier + controlled[i].minTranslate();
                                if (s.params.controlInverse) {
                                    controlledTranslate = controlled[i].maxTranslate() - controlledTranslate
                                }
                                controlled[i].updateProgress(controlledTranslate);
                                controlled[i].setWrapperTranslate(controlledTranslate, false, s);
                                controlled[i].updateActiveIndex()
                            }
                        }
                    } else if (controlled instanceof Swiper && byController !== controlled) {
                        translate = controlled.rtl && controlled.params.direction === "horizontal" ? -s.translate : s.translate;
                        multiplier = (controlled.maxTranslate() - controlled.minTranslate()) / (s.maxTranslate() - s.minTranslate());
                        controlledTranslate = (translate - s.minTranslate()) * multiplier + controlled.minTranslate();
                        if (s.params.controlInverse) {
                            controlledTranslate = controlled.maxTranslate() - controlledTranslate
                        }
                        controlled.updateProgress(controlledTranslate);
                        controlled.setWrapperTranslate(controlledTranslate, false, s);
                        controlled.updateActiveIndex()
                    }
                },
                setTransition: function(duration, byController) {
                    var controlled = s.params.control;
                    if (s.isArray(controlled)) {
                        for (var i = 0; i < controlled.length; i++) {
                            if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
                                controlled[i].setWrapperTransition(duration, s)
                            }
                        }
                    } else if (controlled instanceof Swiper && byController !== controlled) {
                        controlled.setWrapperTransition(duration, s)
                    }
                }
            };

            function setParallaxTransform(el, progress) {
                el = $(el);
                var p, pX, pY;
                p = el.attr("data-swiper-parallax") || "0";
                pX = el.attr("data-swiper-parallax-x");
                pY = el.attr("data-swiper-parallax-y");
                if (pX || pY) {
                    pX = pX || "0";
                    pY = pY || "0"
                } else {
                    if (isH()) {
                        pX = p;
                        pY = "0"
                    } else {
                        pY = p;
                        pX = "0"
                    }
                }
                if (pX.indexOf("%") >= 0) {
                    pX = parseInt(pX, 10) * progress + "%"
                } else {
                    pX = pX * progress + "px"
                }
                if (pY.indexOf("%") >= 0) {
                    pY = parseInt(pY, 10) * progress + "%"
                } else {
                    pY = pY * progress + "px"
                }
                el.transform("translate3d(" + pX + ", " + pY + ",0px)")
            }
            s.parallax = {
                setTranslate: function() {
                    s.container.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function() {
                        setParallaxTransform(this, s.progress)
                    });
                    s.slides.each(function() {
                        var slide = $(this);
                        slide.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function() {
                            var progress = Math.min(Math.max(slide[0].progress, -1), 1);
                            setParallaxTransform(this, progress)
                        })
                    })
                },
                setTransition: function(duration) {
                    if (typeof duration === "undefined") duration = s.params.speed;
                    s.container.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function() {
                        var el = $(this);
                        var parallaxDuration = parseInt(el.attr("data-swiper-parallax-duration"), 10) || duration;
                        if (duration === 0) parallaxDuration = 0;
                        el.transition(parallaxDuration)
                    })
                }
            };
            s._plugins = [];
            for (var plugin in s.plugins) {
                if (s.plugins.hasOwnProperty(plugin)) {
                    var p = s.plugins[plugin](s, s.params[plugin]);
                    if (p) s._plugins.push(p)
                }
            }
            s.callPlugins = function(eventName) {
                for (var i = 0; i < s._plugins.length; i++) {
                    if (eventName in s._plugins[i]) {
                        s._plugins[i][eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])
                    }
                }
            };

            function normalizeEventName(eventName) {
                if (eventName.indexOf("on") !== 0) {
                    if (eventName[0] !== eventName[0].toUpperCase()) {
                        eventName = "on" + eventName[0].toUpperCase() + eventName.substring(1)
                    } else {
                        eventName = "on" + eventName
                    }
                }
                return eventName
            }
            s.emitterEventListeners = {};
            s.emit = function(eventName) {
                if (s.params[eventName]) {
                    s.params[eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])
                }
                var i;
                if (!s) return;
                if (s.emitterEventListeners[eventName]) {
                    for (i = 0; i < s.emitterEventListeners[eventName].length; i++) {
                        s.emitterEventListeners[eventName][i](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])
                    }
                }
                if (s.callPlugins) s.callPlugins(eventName, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])
            };
            s.on = function(eventName, handler) {
                eventName = normalizeEventName(eventName);
                if (!s.emitterEventListeners[eventName]) s.emitterEventListeners[eventName] = [];
                s.emitterEventListeners[eventName].push(handler);
                return s
            };
            s.off = function(eventName, handler) {
                var i;
                eventName = normalizeEventName(eventName);
                if (typeof handler === "undefined") {
                    s.emitterEventListeners[eventName] = [];
                    return s
                }
                if (!s.emitterEventListeners[eventName] || s.emitterEventListeners[eventName].length === 0) return;
                for (i = 0; i < s.emitterEventListeners[eventName].length; i++) {
                    if (s.emitterEventListeners[eventName][i] === handler) s.emitterEventListeners[eventName].splice(i, 1)
                }
                return s
            };
            s.once = function(eventName, handler) {
                eventName = normalizeEventName(eventName);
                var _handler = function() {
                    handler(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                    s.off(eventName, _handler)
                };
                s.on(eventName, _handler);
                return s
            };
            s.a11y = {
                makeFocusable: function($el) {
                    $el[0].tabIndex = "0";
                    return $el
                },
                addRole: function($el, role) {
                    $el.attr("role", role);
                    return $el
                },
                addLabel: function($el, label) {
                    $el.attr("aria-label", label);
                    return $el
                },
                disable: function($el) {
                    $el.attr("aria-disabled", true);
                    return $el
                },
                enable: function($el) {
                    $el.attr("aria-disabled", false);
                    return $el
                },
                onEnterKey: function(event) {
                    if (event.keyCode !== 13) return;
                    if ($(event.target).is(s.params.nextButton)) {
                        s.onClickNext(event);
                        if (s.isEnd) {
                            s.a11y.notify(s.params.lastSlideMsg)
                        } else {
                            s.a11y.notify(s.params.nextSlideMsg)
                        }
                    } else if ($(event.target).is(s.params.prevButton)) {
                        s.onClickPrev(event);
                        if (s.isBeginning) {
                            s.a11y.notify(s.params.firstSlideMsg)
                        } else {
                            s.a11y.notify(s.params.prevSlideMsg)
                        }
                    }
                },
                liveRegion: $('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),
                notify: function(message) {
                    var notification = s.a11y.liveRegion;
                    if (notification.length === 0) return;
                    notification.html("");
                    notification.html(message)
                },
                init: function() {
                    if (s.params.nextButton) {
                        var nextButton = $(s.params.nextButton);
                        s.a11y.makeFocusable(nextButton);
                        s.a11y.addRole(nextButton, "button");
                        s.a11y.addLabel(nextButton, s.params.nextSlideMsg)
                    }
                    if (s.params.prevButton) {
                        var prevButton = $(s.params.prevButton);
                        s.a11y.makeFocusable(prevButton);
                        s.a11y.addRole(prevButton, "button");
                        s.a11y.addLabel(prevButton, s.params.prevSlideMsg)
                    }
                    $(s.container).append(s.a11y.liveRegion)
                },
                destroy: function() {
                    if (s.a11y.liveRegion && s.a11y.liveRegion.length > 0) s.a11y.liveRegion.remove()
                }
            };
            s.init = function() {
                if (s.params.loop) s.createLoop();
                s.updateContainerSize();
                s.updateSlidesSize();
                s.updatePagination();
                if (s.params.scrollbar && s.scrollbar) {
                    s.scrollbar.set()
                }
                if (s.params.effect !== "slide" && s.effects[s.params.effect]) {
                    if (!s.params.loop) s.updateProgress();
                    s.effects[s.params.effect].setTranslate()
                }
                if (s.params.loop) {
                    s.slideTo(s.params.initialSlide + s.loopedSlides, 0, s.params.runCallbacksOnInit)
                } else {
                    s.slideTo(s.params.initialSlide, 0, s.params.runCallbacksOnInit);
                    if (s.params.initialSlide === 0) {
                        if (s.parallax && s.params.parallax) s.parallax.setTranslate();
                        if (s.lazy && s.params.lazyLoading) s.lazy.load()
                    }
                }
                s.attachEvents();
                if (s.params.observer && s.support.observer) {
                    s.initObservers()
                }
                if (s.params.preloadImages && !s.params.lazyLoading) {
                    s.preloadImages()
                }
                if (s.params.autoplay) {
                    s.startAutoplay()
                }
                if (s.params.keyboardControl) {
                    if (s.enableKeyboardControl) s.enableKeyboardControl()
                }
                if (s.params.mousewheelControl) {
                    if (s.enableMousewheelControl) s.enableMousewheelControl()
                }
                if (s.params.hashnav) {
                    if (s.hashnav) s.hashnav.init()
                }
                if (s.params.a11y && s.a11y) s.a11y.init();
                s.emit("onInit", s)
            };
            s.cleanupStyles = function() {
                s.container.removeClass(s.classNames.join(" ")).removeAttr("style");
                s.wrapper.removeAttr("style");
                if (s.slides && s.slides.length) {
                    s.slides.removeClass([s.params.slideVisibleClass, s.params.slideActiveClass, s.params.slideNextClass, s.params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-column").removeAttr("data-swiper-row")
                }
                if (s.paginationContainer && s.paginationContainer.length) {
                    s.paginationContainer.removeClass(s.params.paginationHiddenClass)
                }
                if (s.bullets && s.bullets.length) {
                    s.bullets.removeClass(s.params.bulletActiveClass)
                }
                if (s.params.prevButton) $(s.params.prevButton).removeClass(s.params.buttonDisabledClass);
                if (s.params.nextButton) $(s.params.nextButton).removeClass(s.params.buttonDisabledClass);
                if (s.params.scrollbar && s.scrollbar) {
                    if (s.scrollbar.track && s.scrollbar.track.length) s.scrollbar.track.removeAttr("style");
                    if (s.scrollbar.drag && s.scrollbar.drag.length) s.scrollbar.drag.removeAttr("style")
                }
            };
            s.destroy = function(deleteInstance, cleanupStyles) {
                s.detachEvents();
                s.stopAutoplay();
                if (s.params.loop) {
                    s.destroyLoop()
                }
                if (cleanupStyles) {
                    s.cleanupStyles()
                }
                s.disconnectObservers();
                if (s.params.keyboardControl) {
                    if (s.disableKeyboardControl) s.disableKeyboardControl()
                }
                if (s.params.mousewheelControl) {
                    if (s.disableMousewheelControl) s.disableMousewheelControl()
                }
                if (s.params.a11y && s.a11y) s.a11y.destroy();
                s.emit("onDestroy");
                if (deleteInstance !== false) s = null
            };
            s.init();
            return s
        };
        Swiper.prototype = {
            defaults: {
                direction: "horizontal",
                touchEventsTarget: "container",
                initialSlide: 0,
                speed: 300,
                autoplay: false,
                autoplayDisableOnInteraction: true,
                freeMode: false,
                freeModeMomentum: true,
                freeModeMomentumRatio: 1,
                freeModeMomentumBounce: true,
                freeModeMomentumBounceRatio: 1,
                setWrapperSize: false,
                virtualTranslate: false,
                effect: "slide",
                coverflow: {
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true
                },
                cube: {
                    slideShadows: true,
                    shadow: true,
                    shadowOffset: 20,
                    shadowScale: .94
                },
                fade: {
                    crossFade: false
                },
                parallax: false,
                scrollbar: null,
                scrollbarHide: true,
                keyboardControl: false,
                mousewheelControl: false,
                mousewheelForceToAxis: false,
                hashnav: false,
                spaceBetween: 0,
                slidesPerView: 1,
                slidesPerColumn: 1,
                slidesPerColumnFill: "column",
                slidesPerGroup: 1,
                centeredSlides: false,
                touchRatio: 1,
                touchAngle: 45,
                simulateTouch: true,
                shortSwipes: true,
                longSwipes: true,
                longSwipesRatio: .5,
                longSwipesMs: 300,
                followFinger: true,
                onlyExternal: false,
                threshold: 0,
                touchMoveStopPropagation: true,
                pagination: null,
                paginationClickable: false,
                paginationHide: false,
                paginationBulletRender: null,
                resistance: true,
                resistanceRatio: .85,
                nextButton: null,
                prevButton: null,
                watchSlidesProgress: false,
                watchSlidesVisibility: false,
                grabCursor: false,
                preventClicks: true,
                preventClicksPropagation: true,
                slideToClickedSlide: false,
                lazyLoading: false,
                lazyLoadingInPrevNext: false,
                lazyLoadingOnTransitionStart: false,
                preloadImages: true,
                updateOnImagesReady: true,
                loop: false,
                loopAdditionalSlides: 0,
                loopedSlides: null,
                control: undefined,
                controlInverse: false,
                allowSwipeToPrev: true,
                allowSwipeToNext: true,
                swipeHandler: null,
                noSwiping: true,
                noSwipingClass: "swiper-no-swiping",
                slideClass: "swiper-slide",
                slideActiveClass: "swiper-slide-active",
                slideVisibleClass: "swiper-slide-visible",
                slideDuplicateClass: "swiper-slide-duplicate",
                slideNextClass: "swiper-slide-next",
                slidePrevClass: "swiper-slide-prev",
                wrapperClass: "swiper-wrapper",
                bulletClass: "swiper-pagination-bullet",
                bulletActiveClass: "swiper-pagination-bullet-active",
                buttonDisabledClass: "swiper-button-disabled",
                paginationHiddenClass: "swiper-pagination-hidden",
                observer: false,
                observeParents: false,
                a11y: false,
                prevSlideMessage: "Previous slide",
                nextSlideMessage: "Next slide",
                firstSlideMessage: "This is the first slide",
                lastSlideMessage: "This is the last slide",
                runCallbacksOnInit: true
            },
            isSafari: function() {
                var ua = navigator.userAgent.toLowerCase();
                return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0
            }(),
            isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),
            isArray: function(arr) {
                return Object.prototype.toString.apply(arr) === "[object Array]"
            },
            browser: {
                ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
                ieTouch: window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1
            },
            device: function() {
                var ua = navigator.userAgent;
                var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
                var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
                var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
                return {
                    ios: ipad || iphone || ipad,
                    android: android
                }
            }(),
            support: {
                touch: window.Modernizr && Modernizr.touch === true || function() {
                    return !!("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch)
                }(),
                transforms3d: window.Modernizr && Modernizr.csstransforms3d === true || function() {
                    var div = document.createElement("div").style;
                    return "webkitPerspective" in div || "MozPerspective" in div || "OPerspective" in div || "MsPerspective" in div || "perspective" in div
                }(),
                flexbox: function() {
                    var div = document.createElement("div").style;
                    var styles = "alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" ");
                    for (var i = 0; i < styles.length; i++) {
                        if (styles[i] in div) return true
                    }
                }(),
                observer: function() {
                    return "MutationObserver" in window || "WebkitMutationObserver" in window
                }()
            },
            plugins: {}
        };
        $.Swiper = Swiper
    }(Zepto); + function($) {
        "use strict";
        $.Swiper.prototype.defaults.pagination = ".page-current .swiper-pagination";
        $.swiper = function(container, params) {
            return new $.Swiper(container, params)
        };
        $.fn.swiper = function(params) {
            return new $.Swiper(this, params)
        };
        $.initSwiper = function(pageContainer) {
            var page = $(pageContainer || document.body);
            var swipers = page.find(".swiper-container");
            if (swipers.length === 0) return;

            function destroySwiperOnRemove(slider) {
                function destroySwiper() {
                    slider.destroy();
                    page.off("pageBeforeRemove", destroySwiper)
                }
                page.on("pageBeforeRemove", destroySwiper)
            }
            for (var i = 0; i < swipers.length; i++) {
                var swiper = swipers.eq(i);
                var params;
                if (swiper.data("swiper")) {
                    swiper.data("swiper").update(true);
                    continue
                } else {
                    params = swiper.dataset()
                }
                var _slider = $.swiper(swiper[0], params);
                destroySwiperOnRemove(_slider)
            }
        };
        $.reinitSwiper = function(pageContainer) {
            var page = $(pageContainer || ".page-current");
            var sliders = page.find(".swiper-container");
            if (sliders.length === 0) return;
            for (var i = 0; i < sliders.length; i++) {
                var sliderInstance = sliders[0].swiper;
                if (sliderInstance) {
                    sliderInstance.update(true)
                }
            }
        }
    }(Zepto); + function($) {
        "use strict";
        var PhotoBrowser = function(params) {
            var pb = this,
                i;
            var defaults = this.defaults;
            params = params || {};
            for (var def in defaults) {
                if (typeof params[def] === "undefined") {
                    params[def] = defaults[def]
                }
            }
            pb.params = params;
            var navbarTemplate = pb.params.navbarTemplate || '<header class="bar bar-nav">' + '<a class="icon icon-left pull-left photo-browser-close-link' + (pb.params.type === "popup" ? " close-popup" : "") + '"></a>' + '<h1 class="title"><div class="center sliding"><span class="photo-browser-current"></span> <span class="photo-browser-of">' + pb.params.ofText + '</span> <span class="photo-browser-total"></span></div></h1>' + "</header>";
            var toolbarTemplate = pb.params.toolbarTemplate || '<nav class="bar bar-tab">' + '<a class="tab-item photo-browser-prev" href="#">' + '<i class="icon icon-prev"></i>' + "</a>" + '<a class="tab-item photo-browser-next" href="#">' + '<i class="icon icon-next"></i>' + "</a>" + "</nav>";
            var template = pb.params.template || '<div class="photo-browser photo-browser-' + pb.params.theme + '">' + "{{navbar}}" + "{{toolbar}}" + '<div data-page="photo-browser-slides" class="content">' + "{{captions}}" + '<div class="photo-browser-swiper-container swiper-container">' + '<div class="photo-browser-swiper-wrapper swiper-wrapper">' + "{{photos}}" + "</div>" + "</div>" + "</div>" + "</div>";
            var photoTemplate = !pb.params.lazyLoading ? pb.params.photoTemplate || '<div class="photo-browser-slide swiper-slide"><span class="photo-browser-zoom-container"><img src="{{url}}"></span></div>' : pb.params.photoLazyTemplate || '<div class="photo-browser-slide photo-browser-slide-lazy swiper-slide"><div class="preloader' + (pb.params.theme === "dark" ? " preloader-white" : "") + '"></div><span class="photo-browser-zoom-container"><img data-src="{{url}}" class="swiper-lazy"></span></div>';
            var captionsTheme = pb.params.captionsTheme || pb.params.theme;
            var captionsTemplate = pb.params.captionsTemplate || '<div class="photo-browser-captions photo-browser-captions-' + captionsTheme + '">{{captions}}</div>';
            var captionTemplate = pb.params.captionTemplate || '<div class="photo-browser-caption" data-caption-index="{{captionIndex}}">{{caption}}</div>';
            var objectTemplate = pb.params.objectTemplate || '<div class="photo-browser-slide photo-browser-object-slide swiper-slide">{{html}}</div>';
            var photosHtml = "";
            var captionsHtml = "";
            for (i = 0; i < pb.params.photos.length; i++) {
                var photo = pb.params.photos[i];
                var thisTemplate = "";
                if (typeof photo === "string" || photo instanceof String) {
                    if (photo.indexOf("<") >= 0 || photo.indexOf(">") >= 0) {
                        thisTemplate = objectTemplate.replace(/{{html}}/g, photo)
                    } else {
                        thisTemplate = photoTemplate.replace(/{{url}}/g, photo)
                    }
                } else if (typeof photo === "object") {
                    if (photo.hasOwnProperty("html") && photo.html.length > 0) {
                        thisTemplate = objectTemplate.replace(/{{html}}/g, photo.html)
                    } else if (photo.hasOwnProperty("url") && photo.url.length > 0) {
                        thisTemplate = photoTemplate.replace(/{{url}}/g, photo.url)
                    }
                    if (photo.hasOwnProperty("caption") && photo.caption.length > 0) {
                        captionsHtml += captionTemplate.replace(/{{caption}}/g, photo.caption).replace(/{{captionIndex}}/g, i)
                    } else {
                        thisTemplate = thisTemplate.replace(/{{caption}}/g, "")
                    }
                }
                photosHtml += thisTemplate
            }
            var htmlTemplate = template.replace("{{navbar}}", pb.params.navbar ? navbarTemplate : "").replace("{{noNavbar}}", pb.params.navbar ? "" : "no-navbar").replace("{{photos}}", photosHtml).replace("{{captions}}", captionsTemplate.replace(/{{captions}}/g, captionsHtml)).replace("{{toolbar}}", pb.params.toolbar ? toolbarTemplate : "");
            pb.activeIndex = pb.params.initialSlide;
            pb.openIndex = pb.activeIndex;
            pb.opened = false;
            pb.open = function(index) {
                if (typeof index === "undefined") index = pb.activeIndex;
                index = parseInt(index, 10);
                if (pb.opened && pb.swiper) {
                    pb.swiper.slideTo(index);
                    return
                }
                pb.opened = true;
                pb.openIndex = index;
                if (pb.params.type === "standalone") {
                    $(pb.params.container).append(htmlTemplate)
                }
                if (pb.params.type === "popup") {
                    pb.popup = $.popup('<div class="popup photo-browser-popup">' + htmlTemplate + "</div>");
                    $(pb.popup).on("closed", pb.onPopupClose)
                }
                if (pb.params.type === "page") {
                    $(document).on("pageBeforeInit", pb.onPageBeforeInit);
                    $(document).on("pageBeforeRemove", pb.onPageBeforeRemove);
                    if (!pb.params.view) pb.params.view = $.mainView;
                    pb.params.view.loadContent(htmlTemplate);
                    return
                }
                pb.layout(pb.openIndex);
                if (pb.params.onOpen) {
                    pb.params.onOpen(pb)
                }
            };
            pb.close = function() {
                pb.opened = false;
                if (!pb.swiperContainer || pb.swiperContainer.length === 0) {
                    return
                }
                if (pb.params.onClose) {
                    pb.params.onClose(pb)
                }
                pb.attachEvents(true);
                if (pb.params.type === "standalone") {
                    pb.container.removeClass("photo-browser-in").addClass("photo-browser-out").animationEnd(function() {
                        pb.container.remove()
                    })
                }
                pb.swiper.destroy();
                pb.swiper = pb.swiperContainer = pb.swiperWrapper = pb.slides = gestureSlide = gestureImg = gestureImgWrap = undefined
            };
            pb.onPopupClose = function() {
                pb.close();
                $(pb.popup).off("pageBeforeInit", pb.onPopupClose)
            };
            pb.onPageBeforeInit = function(e) {
                if (e.detail.page.name === "photo-browser-slides") {
                    pb.layout(pb.openIndex)
                }
                $(document).off("pageBeforeInit", pb.onPageBeforeInit)
            };
            pb.onPageBeforeRemove = function(e) {
                if (e.detail.page.name === "photo-browser-slides") {
                    pb.close()
                }
                $(document).off("pageBeforeRemove", pb.onPageBeforeRemove)
            };
            pb.onSliderTransitionStart = function(swiper) {
                pb.activeIndex = swiper.activeIndex;
                var current = swiper.activeIndex + 1;
                var total = swiper.slides.length;
                if (pb.params.loop) {
                    total = total - 2;
                    current = current - swiper.loopedSlides;
                    if (current < 1) current = total + current;
                    if (current > total) current = current - total
                }
                pb.container.find(".photo-browser-current").text(current);
                pb.container.find(".photo-browser-total").text(total);
                $(".photo-browser-prev, .photo-browser-next").removeClass("photo-browser-link-inactive");
                if (swiper.isBeginning && !pb.params.loop) {
                    $(".photo-browser-prev").addClass("photo-browser-link-inactive")
                }
                if (swiper.isEnd && !pb.params.loop) {
                    $(".photo-browser-next").addClass("photo-browser-link-inactive")
                }
                if (pb.captions.length > 0) {
                    pb.captionsContainer.find(".photo-browser-caption-active").removeClass("photo-browser-caption-active");
                    var captionIndex = pb.params.loop ? swiper.slides.eq(swiper.activeIndex).attr("data-swiper-slide-index") : pb.activeIndex;
                    pb.captionsContainer.find('[data-caption-index="' + captionIndex + '"]').addClass("photo-browser-caption-active")
                }
                var previousSlideVideo = swiper.slides.eq(swiper.previousIndex).find("video");
                if (previousSlideVideo.length > 0) {
                    if ("pause" in previousSlideVideo[0]) previousSlideVideo[0].pause()
                }
                if (pb.params.onSlideChangeStart) pb.params.onSlideChangeStart(swiper)
            };
            pb.onSliderTransitionEnd = function(swiper) {
                if (pb.params.zoom && gestureSlide && swiper.previousIndex !== swiper.activeIndex) {
                    gestureImg.transform("translate3d(0,0,0) scale(1)");
                    gestureImgWrap.transform("translate3d(0,0,0)");
                    gestureSlide = gestureImg = gestureImgWrap = undefined;
                    scale = currentScale = 1
                }
                if (pb.params.onSlideChangeEnd) pb.params.onSlideChangeEnd(swiper)
            };
            pb.layout = function(index) {
                if (pb.params.type === "page") {
                    pb.container = $(".photo-browser-swiper-container").parents(".view")
                } else {
                    pb.container = $(".photo-browser")
                }
                if (pb.params.type === "standalone") {
                    pb.container.addClass("photo-browser-in")
                }
                pb.swiperContainer = pb.container.find(".photo-browser-swiper-container");
                pb.swiperWrapper = pb.container.find(".photo-browser-swiper-wrapper");
                pb.slides = pb.container.find(".photo-browser-slide");
                pb.captionsContainer = pb.container.find(".photo-browser-captions");
                pb.captions = pb.container.find(".photo-browser-caption");
                var sliderSettings = {
                    nextButton: pb.params.nextButton || ".photo-browser-next",
                    prevButton: pb.params.prevButton || ".photo-browser-prev",
                    indexButton: pb.params.indexButton,
                    initialSlide: index,
                    spaceBetween: pb.params.spaceBetween,
                    speed: pb.params.speed,
                    loop: pb.params.loop,
                    lazyLoading: pb.params.lazyLoading,
                    lazyLoadingInPrevNext: pb.params.lazyLoadingInPrevNext,
                    lazyLoadingOnTransitionStart: pb.params.lazyLoadingOnTransitionStart,
                    preloadImages: pb.params.lazyLoading ? false : true,
                    onTap: function(swiper, e) {
                        if (pb.params.onTap) pb.params.onTap(swiper, e)
                    },
                    onClick: function(swiper, e) {
                        if (pb.params.exposition) pb.toggleExposition();
                        if (pb.params.onClick) pb.params.onClick(swiper, e)
                    },
                    onDoubleTap: function(swiper, e) {
                        pb.toggleZoom($(e.target).parents(".photo-browser-slide"));
                        if (pb.params.onDoubleTap) pb.params.onDoubleTap(swiper, e)
                    },
                    onTransitionStart: function(swiper) {
                        pb.onSliderTransitionStart(swiper)
                    },
                    onTransitionEnd: function(swiper) {
                        pb.onSliderTransitionEnd(swiper)
                    },
                    onLazyImageLoad: function(swiper, slide, img) {
                        if (pb.params.onLazyImageLoad) pb.params.onLazyImageLoad(pb, slide, img)
                    },
                    onLazyImageReady: function(swiper, slide, img) {
                        $(slide).removeClass("photo-browser-slide-lazy");
                        if (pb.params.onLazyImageReady) pb.params.onLazyImageReady(pb, slide, img)
                    }
                };
                if (pb.params.swipeToClose && pb.params.type !== "page") {
                    sliderSettings.onTouchStart = pb.swipeCloseTouchStart;
                    sliderSettings.onTouchMoveOpposite = pb.swipeCloseTouchMove;
                    sliderSettings.onTouchEnd = pb.swipeCloseTouchEnd
                }
                pb.swiper = $.swiper(pb.swiperContainer, sliderSettings);
                if (index === 0) {
                    pb.onSliderTransitionStart(pb.swiper)
                }
                pb.attachEvents()
            };
            pb.attachEvents = function(detach) {
                var action = detach ? "off" : "on";
                if (pb.params.zoom) {
                    var target = pb.params.loop ? pb.swiper.slides : pb.slides;
                    target[action]("gesturestart", pb.onSlideGestureStart);
                    target[action]("gesturechange", pb.onSlideGestureChange);
                    target[action]("gestureend", pb.onSlideGestureEnd);
                    target[action]("touchstart", pb.onSlideTouchStart);
                    target[action]("touchmove", pb.onSlideTouchMove);
                    target[action]("touchend", pb.onSlideTouchEnd)
                }
                pb.container.find(".photo-browser-close-link")[action]("click", pb.close)
            };
            pb.exposed = false;
            pb.toggleExposition = function() {
                if (pb.container) pb.container.toggleClass("photo-browser-exposed");
                if (pb.params.expositionHideCaptions) pb.captionsContainer.toggleClass("photo-browser-captions-exposed");
                pb.exposed = !pb.exposed
            };
            pb.enableExposition = function() {
                if (pb.container) pb.container.addClass("photo-browser-exposed");
                if (pb.params.expositionHideCaptions) pb.captionsContainer.addClass("photo-browser-captions-exposed");
                pb.exposed = true
            };
            pb.disableExposition = function() {
                if (pb.container) pb.container.removeClass("photo-browser-exposed");
                if (pb.params.expositionHideCaptions) pb.captionsContainer.removeClass("photo-browser-captions-exposed");
                pb.exposed = false
            };
            var gestureSlide, gestureImg, gestureImgWrap, scale = 1,
                currentScale = 1,
                isScaling = false;
            pb.onSlideGestureStart = function() {
                if (!gestureSlide) {
                    gestureSlide = $(this);
                    gestureImg = gestureSlide.find("img, svg, canvas");
                    gestureImgWrap = gestureImg.parent(".photo-browser-zoom-container");
                    if (gestureImgWrap.length === 0) {
                        gestureImg = undefined;
                        return
                    }
                }
                gestureImg.transition(0);
                isScaling = true
            };
            pb.onSlideGestureChange = function(e) {
                if (!gestureImg || gestureImg.length === 0) return;
                scale = e.scale * currentScale;
                if (scale > pb.params.maxZoom) {
                    scale = pb.params.maxZoom - 1 + Math.pow(scale - pb.params.maxZoom + 1, .5)
                }
                if (scale < pb.params.minZoom) {
                    scale = pb.params.minZoom + 1 - Math.pow(pb.params.minZoom - scale + 1, .5)
                }
                gestureImg.transform("translate3d(0,0,0) scale(" + scale + ")")
            };
            pb.onSlideGestureEnd = function() {
                if (!gestureImg || gestureImg.length === 0) return;
                scale = Math.max(Math.min(scale, pb.params.maxZoom), pb.params.minZoom);
                gestureImg.transition(pb.params.speed).transform("translate3d(0,0,0) scale(" + scale + ")");
                currentScale = scale;
                isScaling = false;
                if (scale === 1) gestureSlide = undefined
            };
            pb.toggleZoom = function() {
                if (!gestureSlide) {
                    gestureSlide = pb.swiper.slides.eq(pb.swiper.activeIndex);
                    gestureImg = gestureSlide.find("img, svg, canvas");
                    gestureImgWrap = gestureImg.parent(".photo-browser-zoom-container")
                }
                if (!gestureImg || gestureImg.length === 0) return;
                gestureImgWrap.transition(300).transform("translate3d(0,0,0)");
                if (scale && scale !== 1) {
                    scale = currentScale = 1;
                    gestureImg.transition(300).transform("translate3d(0,0,0) scale(1)");
                    gestureSlide = undefined
                } else {
                    scale = currentScale = pb.params.maxZoom;
                    gestureImg.transition(300).transform("translate3d(0,0,0) scale(" + scale + ")")
                }
            };
            var imageIsTouched, imageIsMoved, imageCurrentX, imageCurrentY, imageMinX, imageMinY, imageMaxX, imageMaxY, imageWidth, imageHeight, imageTouchesStart = {},
                imageTouchesCurrent = {},
                imageStartX, imageStartY, velocityPrevPositionX, velocityPrevTime, velocityX, velocityPrevPositionY, velocityY;
            pb.onSlideTouchStart = function(e) {
                if (!gestureImg || gestureImg.length === 0) return;
                if (imageIsTouched) return;
                if ($.device.os === "android") e.preventDefault();
                imageIsTouched = true;
                imageTouchesStart.x = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX;
                imageTouchesStart.y = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY
            };
            pb.onSlideTouchMove = function(e) {
                if (!gestureImg || gestureImg.length === 0) return;
                pb.swiper.allowClick = false;
                if (!imageIsTouched || !gestureSlide) return;
                if (!imageIsMoved) {
                    imageWidth = gestureImg[0].offsetWidth;
                    imageHeight = gestureImg[0].offsetHeight;
                    imageStartX = $.getTranslate(gestureImgWrap[0], "x") || 0;
                    imageStartY = $.getTranslate(gestureImgWrap[0], "y") || 0;
                    gestureImgWrap.transition(0)
                }
                var scaledWidth = imageWidth * scale;
                var scaledHeight = imageHeight * scale;
                if (scaledWidth < pb.swiper.width && scaledHeight < pb.swiper.height) return;
                imageMinX = Math.min(pb.swiper.width / 2 - scaledWidth / 2, 0);
                imageMaxX = -imageMinX;
                imageMinY = Math.min(pb.swiper.height / 2 - scaledHeight / 2, 0);
                imageMaxY = -imageMinY;
                imageTouchesCurrent.x = e.type === "touchmove" ? e.targetTouches[0].pageX : e.pageX;
                imageTouchesCurrent.y = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY;
                if (!imageIsMoved && !isScaling) {
                    if (Math.floor(imageMinX) === Math.floor(imageStartX) && imageTouchesCurrent.x < imageTouchesStart.x || Math.floor(imageMaxX) === Math.floor(imageStartX) && imageTouchesCurrent.x > imageTouchesStart.x) {
                        imageIsTouched = false;
                        return
                    }
                }
                e.preventDefault();
                e.stopPropagation();
                imageIsMoved = true;
                imageCurrentX = imageTouchesCurrent.x - imageTouchesStart.x + imageStartX;
                imageCurrentY = imageTouchesCurrent.y - imageTouchesStart.y + imageStartY;
                if (imageCurrentX < imageMinX) {
                    imageCurrentX = imageMinX + 1 - Math.pow(imageMinX - imageCurrentX + 1, .8)
                }
                if (imageCurrentX > imageMaxX) {
                    imageCurrentX = imageMaxX - 1 + Math.pow(imageCurrentX - imageMaxX + 1, .8)
                }
                if (imageCurrentY < imageMinY) {
                    imageCurrentY = imageMinY + 1 - Math.pow(imageMinY - imageCurrentY + 1, .8)
                }
                if (imageCurrentY > imageMaxY) {
                    imageCurrentY = imageMaxY - 1 + Math.pow(imageCurrentY - imageMaxY + 1, .8)
                }
                if (!velocityPrevPositionX) velocityPrevPositionX = imageTouchesCurrent.x;
                if (!velocityPrevPositionY) velocityPrevPositionY = imageTouchesCurrent.y;
                if (!velocityPrevTime) velocityPrevTime = Date.now();
                velocityX = (imageTouchesCurrent.x - velocityPrevPositionX) / (Date.now() - velocityPrevTime) / 2;
                velocityY = (imageTouchesCurrent.y - velocityPrevPositionY) / (Date.now() - velocityPrevTime) / 2;
                if (Math.abs(imageTouchesCurrent.x - velocityPrevPositionX) < 2) velocityX = 0;
                if (Math.abs(imageTouchesCurrent.y - velocityPrevPositionY) < 2) velocityY = 0;
                velocityPrevPositionX = imageTouchesCurrent.x;
                velocityPrevPositionY = imageTouchesCurrent.y;
                velocityPrevTime = Date.now();
                gestureImgWrap.transform("translate3d(" + imageCurrentX + "px, " + imageCurrentY + "px,0)")
            };
            pb.onSlideTouchEnd = function() {
                if (!gestureImg || gestureImg.length === 0) return;
                if (!imageIsTouched || !imageIsMoved) {
                    imageIsTouched = false;
                    imageIsMoved = false;
                    return
                }
                imageIsTouched = false;
                imageIsMoved = false;
                var momentumDurationX = 300;
                var momentumDurationY = 300;
                var momentumDistanceX = velocityX * momentumDurationX;
                var newPositionX = imageCurrentX + momentumDistanceX;
                var momentumDistanceY = velocityY * momentumDurationY;
                var newPositionY = imageCurrentY + momentumDistanceY;
                if (velocityX !== 0) momentumDurationX = Math.abs((newPositionX - imageCurrentX) / velocityX);
                if (velocityY !== 0) momentumDurationY = Math.abs((newPositionY - imageCurrentY) / velocityY);
                var momentumDuration = Math.max(momentumDurationX, momentumDurationY);
                imageCurrentX = newPositionX;
                imageCurrentY = newPositionY;
                var scaledWidth = imageWidth * scale;
                var scaledHeight = imageHeight * scale;
                imageMinX = Math.min(pb.swiper.width / 2 - scaledWidth / 2, 0);
                imageMaxX = -imageMinX;
                imageMinY = Math.min(pb.swiper.height / 2 - scaledHeight / 2, 0);
                imageMaxY = -imageMinY;
                imageCurrentX = Math.max(Math.min(imageCurrentX, imageMaxX), imageMinX);
                imageCurrentY = Math.max(Math.min(imageCurrentY, imageMaxY), imageMinY);
                gestureImgWrap.transition(momentumDuration).transform("translate3d(" + imageCurrentX + "px, " + imageCurrentY + "px,0)")
            };
            var swipeToCloseIsTouched = false;
            var allowSwipeToClose = true;
            var swipeToCloseDiff, swipeToCloseStart, swipeToCloseCurrent, swipeToCloseStarted = false,
                swipeToCloseActiveSlide, swipeToCloseTimeStart;
            pb.swipeCloseTouchStart = function() {
                if (!allowSwipeToClose) return;
                swipeToCloseIsTouched = true
            };
            pb.swipeCloseTouchMove = function(swiper, e) {
                if (!swipeToCloseIsTouched) return;
                if (!swipeToCloseStarted) {
                    swipeToCloseStarted = true;
                    swipeToCloseStart = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY;
                    swipeToCloseActiveSlide = pb.swiper.slides.eq(pb.swiper.activeIndex);
                    swipeToCloseTimeStart = (new Date).getTime()
                }
                e.preventDefault();
                swipeToCloseCurrent = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY;
                swipeToCloseDiff = swipeToCloseStart - swipeToCloseCurrent;
                var opacity = 1 - Math.abs(swipeToCloseDiff) / 300;
                swipeToCloseActiveSlide.transform("translate3d(0," + -swipeToCloseDiff + "px,0)");
                pb.swiper.container.css("opacity", opacity).transition(0)
            };
            pb.swipeCloseTouchEnd = function() {
                swipeToCloseIsTouched = false;
                if (!swipeToCloseStarted) {
                    swipeToCloseStarted = false;
                    return
                }
                swipeToCloseStarted = false;
                allowSwipeToClose = false;
                var diff = Math.abs(swipeToCloseDiff);
                var timeDiff = (new Date).getTime() - swipeToCloseTimeStart;
                if (timeDiff < 300 && diff > 20 || timeDiff >= 300 && diff > 100) {
                    setTimeout(function() {
                        if (pb.params.type === "standalone") {
                            pb.close()
                        }
                        if (pb.params.type === "popup") {
                            $.closeModal(pb.popup)
                        }
                        if (pb.params.onSwipeToClose) {
                            pb.params.onSwipeToClose(pb)
                        }
                        allowSwipeToClose = true
                    }, 0);
                    return
                }
                if (diff !== 0) {
                    swipeToCloseActiveSlide.addClass("transitioning").transitionEnd(function() {
                        allowSwipeToClose = true;
                        swipeToCloseActiveSlide.removeClass("transitioning")
                    })
                } else {
                    allowSwipeToClose = true
                }
                pb.swiper.container.css("opacity", "").transition("");
                swipeToCloseActiveSlide.transform("")
            };
            return pb
        };
        PhotoBrowser.prototype = {
            defaults: {
                photos: [],
                container: "body",
                initialSlide: 0,
                spaceBetween: 20,
                speed: 300,
                zoom: true,
                maxZoom: 3,
                minZoom: 1,
                exposition: true,
                expositionHideCaptions: false,
                type: "standalone",
                navbar: true,
                toolbar: true,
                theme: "light",
                swipeToClose: true,
                backLinkText: "Close",
                ofText: "of",
                loop: false,
                lazyLoading: false,
                lazyLoadingInPrevNext: false,
                lazyLoadingOnTransitionStart: false
            }
        };
        $.photoBrowser = function(params) {
            $.extend(params, $.photoBrowser.prototype.defaults);
            return new PhotoBrowser(params)
        };
        $.photoBrowser.prototype = {
            defaults: {}
        }
    }(Zepto)
});
define("xg/jx-business/1.0.0/c/js/fastclick-debug", [], function(require, exports, module) {
    (function() {
        "use strict";

        function FastClick(layer, options) {
            var oldOnClick;
            options = options || {};
            this.trackingClick = false;
            this.trackingClickStart = 0;
            this.targetElement = null;
            this.touchStartX = 0;
            this.touchStartY = 0;
            this.lastTouchIdentifier = 0;
            this.touchBoundary = options.touchBoundary || 10;
            this.layer = layer;
            this.tapDelay = options.tapDelay || 200;
            this.tapTimeout = options.tapTimeout || 700;
            if (FastClick.notNeeded(layer)) {
                return
            }

            function bind(method, context) {
                return function() {
                    return method.apply(context, arguments)
                }
            }
            var methods = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"];
            var context = this;
            for (var i = 0, l = methods.length; i < l; i++) {
                context[methods[i]] = bind(context[methods[i]], context)
            }
            if (deviceIsAndroid) {
                layer.addEventListener("mouseover", this.onMouse, true);
                layer.addEventListener("mousedown", this.onMouse, true);
                layer.addEventListener("mouseup", this.onMouse, true)
            }
            layer.addEventListener("click", this.onClick, true);
            layer.addEventListener("touchstart", this.onTouchStart, false);
            layer.addEventListener("touchmove", this.onTouchMove, false);
            layer.addEventListener("touchend", this.onTouchEnd, false);
            layer.addEventListener("touchcancel", this.onTouchCancel, false);
            if (!Event.prototype.stopImmediatePropagation) {
                layer.removeEventListener = function(type, callback, capture) {
                    var rmv = Node.prototype.removeEventListener;
                    if (type === "click") {
                        rmv.call(layer, type, callback.hijacked || callback, capture)
                    } else {
                        rmv.call(layer, type, callback, capture)
                    }
                };
                layer.addEventListener = function(type, callback, capture) {
                    var adv = Node.prototype.addEventListener;
                    if (type === "click") {
                        adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
                            if (!event.propagationStopped) {
                                callback(event)
                            }
                        }), capture)
                    } else {
                        adv.call(layer, type, callback, capture)
                    }
                }
            }
            if (typeof layer.onclick === "function") {
                oldOnClick = layer.onclick;
                layer.addEventListener("click", function(event) {
                    oldOnClick(event)
                }, false);
                layer.onclick = null
            }
        }
        var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;
        var deviceIsAndroid = navigator.userAgent.indexOf("Android") > 0 && !deviceIsWindowsPhone;
        var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;
        var deviceIsIOS4 = deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent);
        var deviceIsIOSWithBadTarget = deviceIsIOS && /OS [6-7]_\d/.test(navigator.userAgent);
        var deviceIsBlackBerry10 = navigator.userAgent.indexOf("BB10") > 0;
        FastClick.prototype.needsClick = function(target) {
            switch (target.nodeName.toLowerCase()) {
                case "button":
                case "select":
                case "textarea":
                    if (target.disabled) {
                        return true
                    }
                    break;
                case "input":
                    if (deviceIsIOS && target.type === "file" || target.disabled) {
                        return true
                    }
                    break;
                case "label":
                case "iframe":
                case "video":
                    return true
            }
            return /\bneedsclick\b/.test(target.className)
        };
        FastClick.prototype.needsFocus = function(target) {
            switch (target.nodeName.toLowerCase()) {
                case "textarea":
                    return true;
                case "select":
                    return !deviceIsAndroid;
                case "input":
                    switch (target.type) {
                        case "button":
                        case "checkbox":
                        case "file":
                        case "image":
                        case "radio":
                        case "submit":
                            return false
                    }
                    return !target.disabled && !target.readOnly;
                default:
                    return /\bneedsfocus\b/.test(target.className)
            }
        };
        FastClick.prototype.sendClick = function(targetElement, event) {
            var clickEvent, touch;
            if (document.activeElement && document.activeElement !== targetElement) {
                document.activeElement.blur()
            }
            touch = event.changedTouches[0];
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
            clickEvent.forwardedTouchEvent = true;
            targetElement.dispatchEvent(clickEvent)
        };
        FastClick.prototype.determineEventType = function(targetElement) {
            if (deviceIsAndroid && targetElement.tagName.toLowerCase() === "select") {
                return "mousedown"
            }
            return "click"
        };
        FastClick.prototype.focus = function(targetElement) {
            var length;
            if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf("date") !== 0 && targetElement.type !== "time" && targetElement.type !== "month") {
                length = targetElement.value.length;
                targetElement.setSelectionRange(length, length)
            } else {
                targetElement.focus()
            }
        };
        FastClick.prototype.updateScrollParent = function(targetElement) {
            var scrollParent, parentElement;
            scrollParent = targetElement.fastClickScrollParent;
            if (!scrollParent || !scrollParent.contains(targetElement)) {
                parentElement = targetElement;
                do {
                    if (parentElement.scrollHeight > parentElement.offsetHeight) {
                        scrollParent = parentElement;
                        targetElement.fastClickScrollParent = parentElement;
                        break
                    }
                    parentElement = parentElement.parentElement
                } while (parentElement)
            }
            if (scrollParent) {
                scrollParent.fastClickLastScrollTop = scrollParent.scrollTop
            }
        };
        FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
            if (eventTarget.nodeType === Node.TEXT_NODE) {
                return eventTarget.parentNode
            }
            return eventTarget
        };
        FastClick.prototype.onTouchStart = function(event) {
            var targetElement, touch, selection;
            if (event.targetTouches.length > 1) {
                return true
            }
            targetElement = this.getTargetElementFromEventTarget(event.target);
            touch = event.targetTouches[0];
            if (deviceIsIOS) {
                selection = window.getSelection();
                if (selection.rangeCount && !selection.isCollapsed) {
                    return true
                }
                if (!deviceIsIOS4) {
                    if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
                        event.preventDefault();
                        return false
                    }
                    this.lastTouchIdentifier = touch.identifier;
                    this.updateScrollParent(targetElement)
                }
            }
            this.trackingClick = true;
            this.trackingClickStart = event.timeStamp;
            this.targetElement = targetElement;
            this.touchStartX = touch.pageX;
            this.touchStartY = touch.pageY;
            if (event.timeStamp - this.lastClickTime < this.tapDelay) {
                event.preventDefault()
            }
            return true
        };
        FastClick.prototype.touchHasMoved = function(event) {
            var touch = event.changedTouches[0],
                boundary = this.touchBoundary;
            if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
                return true
            }
            return false
        };
        FastClick.prototype.onTouchMove = function(event) {
            if (!this.trackingClick) {
                return true
            }
            if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
                this.trackingClick = false;
                this.targetElement = null
            }
            return true
        };
        FastClick.prototype.findControl = function(labelElement) {
            if (labelElement.control !== undefined) {
                return labelElement.control
            }
            if (labelElement.htmlFor) {
                return document.getElementById(labelElement.htmlFor)
            }
            return labelElement.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
        };
        FastClick.prototype.onTouchEnd = function(event) {
            var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;
            if (!this.trackingClick) {
                return true
            }
            if (event.timeStamp - this.lastClickTime < this.tapDelay) {
                this.cancelNextClick = true;
                return true
            }
            if (event.timeStamp - this.trackingClickStart > this.tapTimeout) {
                return true
            }
            this.cancelNextClick = false;
            this.lastClickTime = event.timeStamp;
            trackingClickStart = this.trackingClickStart;
            this.trackingClick = false;
            this.trackingClickStart = 0;
            if (deviceIsIOSWithBadTarget) {
                touch = event.changedTouches[0];
                targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
                targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent
            }
            targetTagName = targetElement.tagName.toLowerCase();
            if (targetTagName === "label") {
                forElement = this.findControl(targetElement);
                if (forElement) {
                    this.focus(targetElement);
                    if (deviceIsAndroid) {
                        return false
                    }
                    targetElement = forElement
                }
            } else if (this.needsFocus(targetElement)) {
                if (event.timeStamp - trackingClickStart > 100 || deviceIsIOS && window.top !== window && targetTagName === "input") {
                    this.targetElement = null;
                    return false
                }
                this.focus(targetElement);
                this.sendClick(targetElement, event);
                if (!deviceIsIOS || targetTagName !== "select") {
                    this.targetElement = null;
                    event.preventDefault()
                }
                return false
            }
            if (deviceIsIOS && !deviceIsIOS4) {
                scrollParent = targetElement.fastClickScrollParent;
                if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
                    return true
                }
            }
            if (!this.needsClick(targetElement)) {
                event.preventDefault();
                this.sendClick(targetElement, event)
            }
            return false
        };
        FastClick.prototype.onTouchCancel = function() {
            this.trackingClick = false;
            this.targetElement = null
        };
        FastClick.prototype.onMouse = function(event) {
            if (!this.targetElement) {
                return true
            }
            if (event.forwardedTouchEvent) {
                return true
            }
            if (!event.cancelable) {
                return true
            }
            if (!this.needsClick(this.targetElement) || this.cancelNextClick) {
                if (event.stopImmediatePropagation) {
                    event.stopImmediatePropagation()
                } else {
                    event.propagationStopped = true
                }
                event.stopPropagation();
                event.preventDefault();
                return false
            }
            return true
        };
        FastClick.prototype.onClick = function(event) {
            var permitted;
            if (this.trackingClick) {
                this.targetElement = null;
                this.trackingClick = false;
                return true
            }
            if (event.target.type === "submit" && event.detail === 0) {
                return true
            }
            permitted = this.onMouse(event);
            if (!permitted) {
                this.targetElement = null
            }
            return permitted
        };
        FastClick.prototype.destroy = function() {
            var layer = this.layer;
            if (deviceIsAndroid) {
                layer.removeEventListener("mouseover", this.onMouse, true);
                layer.removeEventListener("mousedown", this.onMouse, true);
                layer.removeEventListener("mouseup", this.onMouse, true)
            }
            layer.removeEventListener("click", this.onClick, true);
            layer.removeEventListener("touchstart", this.onTouchStart, false);
            layer.removeEventListener("touchmove", this.onTouchMove, false);
            layer.removeEventListener("touchend", this.onTouchEnd, false);
            layer.removeEventListener("touchcancel", this.onTouchCancel, false)
        };
        FastClick.notNeeded = function(layer) {
            var metaViewport;
            var chromeVersion;
            var blackberryVersion;
            var firefoxVersion;
            if (typeof window.ontouchstart === "undefined") {
                return true
            }
            chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];
            if (chromeVersion) {
                if (deviceIsAndroid) {
                    metaViewport = document.querySelector("meta[name=viewport]");
                    if (metaViewport) {
                        if (metaViewport.content.indexOf("user-scalable=no") !== -1) {
                            return true
                        }
                        if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
                            return true
                        }
                    }
                } else {
                    return true
                }
            }
            if (deviceIsBlackBerry10) {
                blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);
                if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
                    metaViewport = document.querySelector("meta[name=viewport]");
                    if (metaViewport) {
                        if (metaViewport.content.indexOf("user-scalable=no") !== -1) {
                            return true
                        }
                        if (document.documentElement.scrollWidth <= window.outerWidth) {
                            return true
                        }
                    }
                }
            }
            if (layer.style.msTouchAction === "none" || layer.style.touchAction === "manipulation") {
                return true
            }
            firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];
            if (firefoxVersion >= 27) {
                metaViewport = document.querySelector("meta[name=viewport]");
                if (metaViewport && (metaViewport.content.indexOf("user-scalable=no") !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
                    return true
                }
            }
            if (layer.style.touchAction === "none" || layer.style.touchAction === "manipulation") {
                return true
            }
            return false
        };
        FastClick.attach = function(layer, options) {
            return new FastClick(layer, options)
        };
        if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
            define(function() {
                return FastClick
            })
        } else if (typeof module !== "undefined" && module.exports) {
            module.exports = FastClick.attach;
            module.exports.FastClick = FastClick
        } else {
            window.FastClick = FastClick
        }
    })()
});
define("xg/jx-business/1.0.0/c/js/base/zepto-debug.jx", [], function(require, exports, module) {
    (function($, undefined) {
        var prefix = "",
            eventPrefix, vendors = {
                Webkit: "webkit",
                Moz: "",
                O: "o"
            },
            testEl = document.createElement("div"),
            supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
            transform, transitionProperty, transitionDuration, transitionTiming, transitionDelay, animationName, animationDuration, animationTiming, animationDelay, cssReset = {};

        function dasherize(str) {
            return str.replace(/([A-Z])/g, "-$1").toLowerCase()
        }

        function normalizeEvent(name) {
            return eventPrefix ? eventPrefix + name : name.toLowerCase()
        }
        if (testEl.style.transform === undefined) $.each(vendors, function(vendor, event) {
            if (testEl.style[vendor + "TransitionProperty"] !== undefined) {
                prefix = "-" + vendor.toLowerCase() + "-";
                eventPrefix = event;
                return false
            }
        });
        transform = prefix + "transform";
        cssReset[transitionProperty = prefix + "transition-property"] = cssReset[transitionDuration = prefix + "transition-duration"] = cssReset[transitionDelay = prefix + "transition-delay"] = cssReset[transitionTiming = prefix + "transition-timing-function"] = cssReset[animationName = prefix + "animation-name"] = cssReset[animationDuration = prefix + "animation-duration"] = cssReset[animationDelay = prefix + "animation-delay"] = cssReset[animationTiming = prefix + "animation-timing-function"] = "";
        $.fx = {
            off: eventPrefix === undefined && testEl.style.transitionProperty === undefined,
            speeds: {
                _default: 400,
                fast: 200,
                slow: 600
            },
            cssPrefix: prefix,
            transitionEnd: normalizeEvent("TransitionEnd"),
            animationEnd: normalizeEvent("AnimationEnd")
        };
        $.fn.animate = function(properties, duration, ease, callback, delay) {
            if ($.isFunction(duration)) callback = duration, ease = undefined, duration = undefined;
            if ($.isFunction(ease)) callback = ease, ease = undefined;
            if ($.isPlainObject(duration)) ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration;
            if (duration) duration = (typeof duration == "number" ? duration : $.fx.speeds[duration] || $.fx.speeds._default) / 1e3;
            if (delay) delay = parseFloat(delay) / 1e3;
            return this.anim(properties, duration, ease, callback, delay)
        };
        $.fn.anim = function(properties, duration, ease, callback, delay) {
            var key, cssValues = {},
                cssProperties, transforms = "",
                that = this,
                wrappedCallback, endEvent = $.fx.transitionEnd,
                fired = false;
            if (duration === undefined) duration = $.fx.speeds._default / 1e3;
            if (delay === undefined) delay = 0;
            if ($.fx.off) duration = 0;
            if (typeof properties == "string") {
                cssValues[animationName] = properties;
                cssValues[animationDuration] = duration + "s";
                cssValues[animationDelay] = delay + "s";
                cssValues[animationTiming] = ease || "linear";
                endEvent = $.fx.animationEnd
            } else {
                cssProperties = [];
                for (key in properties)
                    if (supportedTransforms.test(key)) transforms += key + "(" + properties[key] + ") ";
                    else cssValues[key] = properties[key], cssProperties.push(dasherize(key));
                if (transforms) cssValues[transform] = transforms, cssProperties.push(transform);
                if (duration > 0 && typeof properties === "object") {
                    cssValues[transitionProperty] = cssProperties.join(", ");
                    cssValues[transitionDuration] = duration + "s";
                    cssValues[transitionDelay] = delay + "s";
                    cssValues[transitionTiming] = ease || "linear"
                }
            }
            wrappedCallback = function(event) {
                if (typeof event !== "undefined") {
                    if (event.target !== event.currentTarget) return;
                    $(event.target).unbind(endEvent, wrappedCallback)
                } else $(this).unbind(endEvent, wrappedCallback);
                fired = true;
                $(this).css(cssReset);
                callback && callback.call(this)
            };
            if (duration > 0) {
                this.bind(endEvent, wrappedCallback);
                setTimeout(function() {
                    if (fired) return;
                    wrappedCallback.call(that)
                }, (duration + delay) * 1e3 + 25)
            }
            this.size() && this.get(0).clientLeft;
            this.css(cssValues);
            if (duration <= 0) setTimeout(function() {
                that.each(function() {
                    wrappedCallback.call(this)
                })
            }, 0);
            return this
        };
        testEl = null
    })(Zepto)
});
define("xg/jx-business/1.0.0/c/js/tools-debug", ["xg/jx-business/1.0.0/c/js/base/zepto-debug.deferred", "xg/jx-business/1.0.0/c/js/base/zepto-debug.callbacks"], function(require, exports, module) {
    require("xg/jx-business/1.0.0/c/js/base/zepto-debug.deferred");
    require("xg/jx-business/1.0.0/c/js/base/zepto-debug.callbacks");
    module.exports = {
        GetQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null
        },
        GetRequest: function() {
            var url = location.search;
            var theRequest = new Object;
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1])
                }
            }
            return theRequest
        },
        arrayUnique: function(arr) {
            var n = {},
                r = [];
            for (var i = 0; i < arr.length; i++) {
                if (!n[arr[i]]) {
                    n[arr[i]] = true;
                    r.push(arr[i])
                }
            }
            return r
        },
        throttle: function(fn, delay, immediate, debounce) {
            var curr = +new Date,
                last_call = 0,
                last_exec = 0,
                timer = null,
                diff, context, args, exec = function() {
                    last_exec = curr;
                    fn.apply(context, args)
                };
            return function() {
                curr = +new Date;
                context = this, args = arguments, diff = curr - (debounce ? last_call : last_exec) - delay;
                clearTimeout(timer);
                if (debounce) {
                    if (immediate) {
                        timer = setTimeout(exec, delay)
                    } else if (diff >= 0) {
                        exec()
                    }
                } else {
                    if (diff >= 0) {
                        exec()
                    } else if (immediate) {
                        timer = setTimeout(exec, -diff)
                    }
                }
                last_call = curr
            }
        },
        debounce: function(fn, delay, immediate) {
            return module.exports.throttle(fn, delay, immediate, true)
        },
        searchNumber: function(array, findNumber) {
            var defer = $.Deferred();
            for (var i = 0; i < array.length; i++) {
                if (array[i] == findNumber) {
                    defer.resolve(true);
                    return i
                }
            }
            return defer.promise()
        }
    }
});
define("xg/jx-business/1.0.0/c/js/iscroll-infinite-debug", [], function(require, exports, module) {
    (function(window, document, Math) {
        var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1e3 / 60)
        };
        var utils = function() {
            var me = {};
            var _elementStyle = document.createElement("div").style;
            var _vendor = function() {
                var vendors = ["t", "webkitT", "MozT", "msT", "OT"],
                    transform, i = 0,
                    l = vendors.length;
                for (; i < l; i++) {
                    transform = vendors[i] + "ransform";
                    if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1)
                }
                return false
            }();

            function _prefixStyle(style) {
                if (_vendor === false) return false;
                if (_vendor === "") return style;
                return _vendor + style.charAt(0).toUpperCase() + style.substr(1)
            }
            me.getTime = Date.now || function getTime() {
                return (new Date).getTime()
            };
            me.extend = function(target, obj) {
                for (var i in obj) {
                    target[i] = obj[i]
                }
            };
            me.addEvent = function(el, type, fn, capture) {
                el.addEventListener(type, fn, !!capture)
            };
            me.removeEvent = function(el, type, fn, capture) {
                el.removeEventListener(type, fn, !!capture)
            };
            me.prefixPointerEvent = function(pointerEvent) {
                return window.MSPointerEvent ? "MSPointer" + pointerEvent.charAt(7).toUpperCase() + pointerEvent.substr(8) : pointerEvent
            };
            me.momentum = function(current, start, time, lowerMargin, wrapperSize, deceleration) {
                var distance = current - start,
                    speed = Math.abs(distance) / time,
                    destination, duration;
                deceleration = deceleration === undefined ? 6e-4 : deceleration;
                destination = current + speed * speed / (2 * deceleration) * (distance < 0 ? -1 : 1);
                duration = speed / deceleration;
                if (destination < lowerMargin) {
                    destination = wrapperSize ? lowerMargin - wrapperSize / 2.5 * (speed / 8) : lowerMargin;
                    distance = Math.abs(destination - current);
                    duration = distance / speed
                } else if (destination > 0) {
                    destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
                    distance = Math.abs(current) + destination;
                    duration = distance / speed
                }
                return {
                    destination: Math.round(destination),
                    duration: duration
                }
            };
            var _transform = _prefixStyle("transform");
            me.extend(me, {
                hasTransform: _transform !== false,
                hasPerspective: _prefixStyle("perspective") in _elementStyle,
                hasTouch: "ontouchstart" in window,
                hasPointer: !!(window.PointerEvent || window.MSPointerEvent),
                hasTransition: _prefixStyle("transition") in _elementStyle
            });
            me.isBadAndroid = function() {
                var appVersion = window.navigator.appVersion;
                if (/Android/.test(appVersion) && !/Chrome\/\d/.test(appVersion)) {
                    var safariVersion = appVersion.match(/Safari\/(\d+.\d)/);
                    if (safariVersion && typeof safariVersion === "object" && safariVersion.length >= 2) {
                        return parseFloat(safariVersion[1]) < 535.19
                    } else {
                        return true
                    }
                } else {
                    return false
                }
            }();
            me.extend(me.style = {}, {
                transform: _transform,
                transitionTimingFunction: _prefixStyle("transitionTimingFunction"),
                transitionDuration: _prefixStyle("transitionDuration"),
                transitionDelay: _prefixStyle("transitionDelay"),
                transformOrigin: _prefixStyle("transformOrigin")
            });
            me.hasClass = function(e, c) {
                var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
                return re.test(e.className)
            };
            me.addClass = function(e, c) {
                if (me.hasClass(e, c)) {
                    return
                }
                var newclass = e.className.split(" ");
                newclass.push(c);
                e.className = newclass.join(" ")
            };
            me.removeClass = function(e, c) {
                if (!me.hasClass(e, c)) {
                    return
                }
                var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
                e.className = e.className.replace(re, " ")
            };
            me.offset = function(el) {
                var left = -el.offsetLeft,
                    top = -el.offsetTop;
                while (el = el.offsetParent) {
                    left -= el.offsetLeft;
                    top -= el.offsetTop
                }
                return {
                    left: left,
                    top: top
                }
            };
            me.preventDefaultException = function(el, exceptions) {
                for (var i in exceptions) {
                    if (exceptions[i].test(el[i])) {
                        return true
                    }
                }
                return false
            };
            me.extend(me.eventType = {}, {
                touchstart: 1,
                touchmove: 1,
                touchend: 1,
                mousedown: 2,
                mousemove: 2,
                mouseup: 2,
                pointerdown: 3,
                pointermove: 3,
                pointerup: 3,
                MSPointerDown: 3,
                MSPointerMove: 3,
                MSPointerUp: 3
            });
            me.extend(me.ease = {}, {
                quadratic: {
                    style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    fn: function(k) {
                        return k * (2 - k)
                    }
                },
                circular: {
                    style: "cubic-bezier(0.1, 0.57, 0.1, 1)",
                    fn: function(k) {
                        return Math.sqrt(1 - --k * k)
                    }
                },
                back: {
                    style: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    fn: function(k) {
                        var b = 4;
                        return (k = k - 1) * k * ((b + 1) * k + b) + 1
                    }
                },
                bounce: {
                    style: "",
                    fn: function(k) {
                        if ((k /= 1) < 1 / 2.75) {
                            return 7.5625 * k * k
                        } else if (k < 2 / 2.75) {
                            return 7.5625 * (k -= 1.5 / 2.75) * k + .75
                        } else if (k < 2.5 / 2.75) {
                            return 7.5625 * (k -= 2.25 / 2.75) * k + .9375
                        } else {
                            return 7.5625 * (k -= 2.625 / 2.75) * k + .984375
                        }
                    }
                },
                elastic: {
                    style: "",
                    fn: function(k) {
                        var f = .22,
                            e = .4;
                        if (k === 0) {
                            return 0
                        }
                        if (k == 1) {
                            return 1
                        }
                        return e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1
                    }
                }
            });
            me.tap = function(e, eventName) {
                var ev = document.createEvent("Event");
                ev.initEvent(eventName, true, true);
                ev.pageX = e.pageX;
                ev.pageY = e.pageY;
                e.target.dispatchEvent(ev)
            };
            me.click = function(e) {
                var target = e.target,
                    ev;
                if (!/(SELECT|INPUT|TEXTAREA)/i.test(target.tagName)) {
                    ev = document.createEvent(window.MouseEvent ? "MouseEvents" : "Event");
                    ev.initEvent("click", true, true);
                    ev.view = e.view || window;
                    ev.detail = 1;
                    ev.screenX = target.screenX || 0;
                    ev.screenY = target.screenY || 0;
                    ev.clientX = target.clientX || 0;
                    ev.clientY = target.clientY || 0;
                    ev.ctrlKey = !!e.ctrlKey;
                    ev.altKey = !!e.altKey;
                    ev.shiftKey = !!e.shiftKey;
                    ev.metaKey = !!e.metaKey;
                    ev.button = 0;
                    ev.relatedTarget = null;
                    ev._constructed = true;
                    target.dispatchEvent(ev)
                }
            };
            return me
        }();

        function IScroll(el, options) {
            this.wrapper = typeof el == "string" ? document.querySelector(el) : el;
            this.scroller = this.wrapper.children[0];
            this.scrollerStyle = this.scroller.style;
            this.options = {
                mouseWheelSpeed: 20,
                snapThreshold: .334,
                infiniteUseTransform: true,
                deceleration: .004,
                disablePointer: !utils.hasPointer,
                disableTouch: utils.hasPointer || !utils.hasTouch,
                disableMouse: utils.hasPointer || utils.hasTouch,
                startX: 0,
                startY: 0,
                scrollY: true,
                directionLockThreshold: 5,
                momentum: true,
                bounce: true,
                bounceTime: 600,
                bounceEasing: "",
                preventDefault: true,
                preventDefaultException: {
                    tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
                },
                HWCompositing: true,
                useTransition: true,
                useTransform: true,
                bindToWrapper: typeof window.onmousedown === "undefined"
            };
            for (var i in options) {
                this.options[i] = options[i]
            }
            this.translateZ = this.options.HWCompositing && utils.hasPerspective ? " translateZ(0)" : "";
            this.options.useTransition = utils.hasTransition && this.options.useTransition;
            this.options.useTransform = utils.hasTransform && this.options.useTransform;
            this.options.eventPassthrough = this.options.eventPassthrough === true ? "vertical" : this.options.eventPassthrough;
            this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;
            this.options.scrollY = this.options.eventPassthrough == "vertical" ? false : this.options.scrollY;
            this.options.scrollX = this.options.eventPassthrough == "horizontal" ? false : this.options.scrollX;
            this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
            this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;
            this.options.bounceEasing = typeof this.options.bounceEasing == "string" ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;
            this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;
            if (this.options.tap === true) {
                this.options.tap = "tap"
            }
            if (!this.options.useTransition && !this.options.useTransform) {
                if (!/relative|absolute/i.test(this.scrollerStyle.position)) {
                    this.scrollerStyle.position = "relative"
                }
            }
            this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;
            if (this.options.infiniteElements) {
                this.options.probeType = 3
            }
            this.options.infiniteUseTransform = this.options.infiniteUseTransform && this.options.useTransform;
            if (this.options.probeType == 3) {
                this.options.useTransition = false
            }
            this.x = 0;
            this.y = 0;
            this.directionX = 0;
            this.directionY = 0;
            this._events = {};
            this._init();
            this.refresh();
            this.scrollTo(this.options.startX, this.options.startY);
            this.enable()
        }
        IScroll.prototype = {
            version: "5.2.0",
            _init: function() {
                this._initEvents();
                if (this.options.mouseWheel) {
                    this._initWheel()
                }
                if (this.options.snap) {
                    this._initSnap()
                }
                if (this.options.keyBindings) {
                    this._initKeys()
                }
                if (this.options.infiniteElements) {
                    this._initInfinite()
                }
            },
            destroy: function() {
                this._initEvents(true);
                clearTimeout(this.resizeTimeout);
                this.resizeTimeout = null;
                this._execEvent("destroy")
            },
            _transitionEnd: function(e) {
                if (e.target != this.scroller || !this.isInTransition) {
                    return
                }
                this._transitionTime();
                if (!this.resetPosition(this.options.bounceTime)) {
                    this.isInTransition = false;
                    this._execEvent("scrollEnd")
                }
            },
            _start: function(e) {
                if (utils.eventType[e.type] != 1) {
                    var button;
                    if (!e.which) {
                        button = e.button < 2 ? 0 : e.button == 4 ? 1 : 2
                    } else {
                        button = e.button
                    }
                    if (button !== 0) {
                        return
                    }
                }
                if (!this.enabled || this.initiated && utils.eventType[e.type] !== this.initiated) {
                    return
                }
                if (this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                    e.preventDefault()
                }
                var point = e.touches ? e.touches[0] : e,
                    pos;
                this.initiated = utils.eventType[e.type];
                this.moved = false;
                this.distX = 0;
                this.distY = 0;
                this.directionX = 0;
                this.directionY = 0;
                this.directionLocked = 0;
                this.startTime = utils.getTime();
                if (this.options.useTransition && this.isInTransition) {
                    this._transitionTime();
                    this.isInTransition = false;
                    pos = this.getComputedPosition();
                    this._translate(Math.round(pos.x), Math.round(pos.y));
                    this._execEvent("scrollEnd")
                } else if (!this.options.useTransition && this.isAnimating) {
                    this.isAnimating = false;
                    this._execEvent("scrollEnd")
                }
                this.startX = this.x;
                this.startY = this.y;
                this.absStartX = this.x;
                this.absStartY = this.y;
                this.pointX = point.pageX;
                this.pointY = point.pageY;
                this._execEvent("beforeScrollStart")
            },
            _move: function(e) {
                if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                    return
                }
                if (this.options.preventDefault) {
                    e.preventDefault()
                }
                var point = e.touches ? e.touches[0] : e,
                    deltaX = point.pageX - this.pointX,
                    deltaY = point.pageY - this.pointY,
                    timestamp = utils.getTime(),
                    newX, newY, absDistX, absDistY;
                this.pointX = point.pageX;
                this.pointY = point.pageY;
                this.distX += deltaX;
                this.distY += deltaY;
                absDistX = Math.abs(this.distX);
                absDistY = Math.abs(this.distY);
                if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
                    return
                }
                if (!this.directionLocked && !this.options.freeScroll) {
                    if (absDistX > absDistY + this.options.directionLockThreshold) {
                        this.directionLocked = "h"
                    } else if (absDistY >= absDistX + this.options.directionLockThreshold) {
                        this.directionLocked = "v"
                    } else {
                        this.directionLocked = "n"
                    }
                }
                if (this.directionLocked == "h") {
                    if (this.options.eventPassthrough == "vertical") {
                        e.preventDefault()
                    } else if (this.options.eventPassthrough == "horizontal") {
                        this.initiated = false;
                        return
                    }
                    deltaY = 0
                } else if (this.directionLocked == "v") {
                    if (this.options.eventPassthrough == "horizontal") {
                        e.preventDefault()
                    } else if (this.options.eventPassthrough == "vertical") {
                        this.initiated = false;
                        return
                    }
                    deltaX = 0
                }
                deltaX = this.hasHorizontalScroll ? deltaX : 0;
                deltaY = this.hasVerticalScroll ? deltaY : 0;
                newX = this.x + deltaX;
                newY = this.y + deltaY;
                if (newX > 0 || newX < this.maxScrollX) {
                    newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX
                }
                if (newY > 0 || newY < this.maxScrollY) {
                    newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY
                }
                this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
                this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;
                if (!this.moved) {
                    this._execEvent("scrollStart")
                }
                this.moved = true;
                this._translate(newX, newY);
                if (timestamp - this.startTime > 300) {
                    this.startTime = timestamp;
                    this.startX = this.x;
                    this.startY = this.y;
                    if (this.options.probeType == 1) {
                        this._execEvent("scroll")
                    }
                }
                if (this.options.probeType > 1) {
                    this._execEvent("scroll")
                }
            },
            _end: function(e) {
                if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                    return
                }
                if (this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                    e.preventDefault()
                }
                var point = e.changedTouches ? e.changedTouches[0] : e,
                    momentumX, momentumY, duration = utils.getTime() - this.startTime,
                    newX = Math.round(this.x),
                    newY = Math.round(this.y),
                    distanceX = Math.abs(newX - this.startX),
                    distanceY = Math.abs(newY - this.startY),
                    time = 0,
                    easing = "";
                this.isInTransition = 0;
                this.initiated = 0;
                this.endTime = utils.getTime();
                if (this.resetPosition(this.options.bounceTime)) {
                    return
                }
                this.scrollTo(newX, newY);
                if (!this.moved) {
                    if (this.options.tap) {
                        utils.tap(e, this.options.tap)
                    }
                    if (this.options.click) {
                        utils.click(e)
                    }
                    this._execEvent("scrollCancel");
                    return
                }
                if (this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100) {
                    this._execEvent("flick");
                    return
                }
                if (this.options.momentum && duration < 300) {
                    momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
                        destination: newX,
                        duration: 0
                    };
                    momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
                        destination: newY,
                        duration: 0
                    };
                    newX = momentumX.destination;
                    newY = momentumY.destination;
                    time = Math.max(momentumX.duration, momentumY.duration);
                    this.isInTransition = 1
                }
                if (this.options.snap) {
                    var snap = this._nearestSnap(newX, newY);
                    this.currentPage = snap;
                    time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(newX - snap.x), 1e3), Math.min(Math.abs(newY - snap.y), 1e3)), 300);
                    newX = snap.x;
                    newY = snap.y;
                    this.directionX = 0;
                    this.directionY = 0;
                    easing = this.options.bounceEasing
                }
                if (newX != this.x || newY != this.y) {
                    if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
                        easing = utils.ease.quadratic
                    }
                    this.scrollTo(newX, newY, time, easing);
                    return
                }
                this._execEvent("scrollEnd")
            },
            _resize: function() {
                var that = this;
                clearTimeout(this.resizeTimeout);
                this.resizeTimeout = setTimeout(function() {
                    that.refresh()
                }, this.options.resizePolling)
            },
            resetPosition: function(time) {
                var x = this.x,
                    y = this.y;
                time = time || 0;
                if (!this.hasHorizontalScroll || this.x > 0) {
                    x = 0
                } else if (this.x < this.maxScrollX) {
                    x = this.maxScrollX
                }
                if (!this.hasVerticalScroll || this.y > 0) {
                    y = 0
                } else if (this.y < this.maxScrollY) {
                    y = this.maxScrollY
                }
                if (x == this.x && y == this.y) {
                    return false
                }
                this.scrollTo(x, y, time, this.options.bounceEasing);
                return true
            },
            disable: function() {
                this.enabled = false
            },
            enable: function() {
                this.enabled = true
            },
            refresh: function() {
                var rf = this.wrapper.offsetHeight;
                this.wrapperWidth = this.wrapper.clientWidth;
                this.wrapperHeight = this.wrapper.clientHeight;
                this.scrollerWidth = this.scroller.offsetWidth;
                this.scrollerHeight = this.scroller.offsetHeight;
                this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
                var limit;
                if (this.options.infiniteElements) {
                    this.options.infiniteLimit = this.options.infiniteLimit || Math.floor(2147483645 / this.infiniteElementHeight);
                    limit = -this.options.infiniteLimit * this.infiniteElementHeight + this.wrapperHeight
                }
                this.maxScrollY = limit !== undefined ? limit : this.wrapperHeight - this.scrollerHeight;
                this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
                this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;
                if (!this.hasHorizontalScroll) {
                    this.maxScrollX = 0;
                    this.scrollerWidth = this.wrapperWidth
                }
                if (!this.hasVerticalScroll) {
                    this.maxScrollY = 0;
                    this.scrollerHeight = this.wrapperHeight
                }
                this.endTime = 0;
                this.directionX = 0;
                this.directionY = 0;
                this.wrapperOffset = utils.offset(this.wrapper);
                this._execEvent("refresh");
                this.resetPosition()
            },
            on: function(type, fn) {
                if (!this._events[type]) {
                    this._events[type] = []
                }
                this._events[type].push(fn)
            },
            off: function(type, fn) {
                if (!this._events[type]) {
                    return
                }
                var index = this._events[type].indexOf(fn);
                if (index > -1) {
                    this._events[type].splice(index, 1)
                }
            },
            _execEvent: function(type) {
                if (!this._events[type]) {
                    return
                }
                var i = 0,
                    l = this._events[type].length;
                if (!l) {
                    return
                }
                for (; i < l; i++) {
                    this._events[type][i].apply(this, [].slice.call(arguments, 1))
                }
            },
            scrollBy: function(x, y, time, easing) {
                x = this.x + x;
                y = this.y + y;
                time = time || 0;
                this.scrollTo(x, y, time, easing)
            },
            scrollTo: function(x, y, time, easing) {
                easing = easing || utils.ease.circular;
                this.isInTransition = this.options.useTransition && time > 0;
                var transitionType = this.options.useTransition && easing.style;
                if (!time || transitionType) {
                    if (transitionType) {
                        this._transitionTimingFunction(easing.style);
                        this._transitionTime(time)
                    }
                    this._translate(x, y)
                } else {
                    this._animate(x, y, time, easing.fn)
                }
            },
            scrollToElement: function(el, time, offsetX, offsetY, easing) {
                el = el.nodeType ? el : this.scroller.querySelector(el);
                if (!el) {
                    return
                }
                var pos = utils.offset(el);
                pos.left -= this.wrapperOffset.left;
                pos.top -= this.wrapperOffset.top;
                if (offsetX === true) {
                    offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2)
                }
                if (offsetY === true) {
                    offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2)
                }
                pos.left -= offsetX || 0;
                pos.top -= offsetY || 0;
                pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
                pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top;
                time = time === undefined || time === null || time === "auto" ? Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top)) : time;
                this.scrollTo(pos.left, pos.top, time, easing)
            },
            _transitionTime: function(time) {
                if (!this.options.useTransition) {
                    return
                }
                time = time || 0;
                var durationProp = utils.style.transitionDuration;
                if (!durationProp) {
                    return
                }
                this.scrollerStyle[durationProp] = time + "ms";
                if (!time && utils.isBadAndroid) {
                    this.scrollerStyle[durationProp] = "0.0001ms";
                    var self = this;
                    rAF(function() {
                        if (self.scrollerStyle[durationProp] === "0.0001ms") {
                            self.scrollerStyle[durationProp] = "0s"
                        }
                    })
                }
            },
            _transitionTimingFunction: function(easing) {
                this.scrollerStyle[utils.style.transitionTimingFunction] = easing
            },
            _translate: function(x, y) {
                if (this.options.useTransform) {
                    this.scrollerStyle[utils.style.transform] = "translate(" + x + "px," + y + "px)" + this.translateZ
                } else {
                    x = Math.round(x);
                    y = Math.round(y);
                    this.scrollerStyle.left = x + "px";
                    this.scrollerStyle.top = y + "px"
                }
                this.x = x;
                this.y = y
            },
            _initEvents: function(remove) {
                var eventType = remove ? utils.removeEvent : utils.addEvent,
                    target = this.options.bindToWrapper ? this.wrapper : window;
                eventType(window, "orientationchange", this);
                eventType(window, "resize", this);
                if (this.options.click) {
                    eventType(this.wrapper, "click", this, true)
                }
                if (!this.options.disableMouse) {
                    eventType(this.wrapper, "mousedown", this);
                    eventType(target, "mousemove", this);
                    eventType(target, "mousecancel", this);
                    eventType(target, "mouseup", this)
                }
                if (utils.hasPointer && !this.options.disablePointer) {
                    eventType(this.wrapper, utils.prefixPointerEvent("pointerdown"), this);
                    eventType(target, utils.prefixPointerEvent("pointermove"), this);
                    eventType(target, utils.prefixPointerEvent("pointercancel"), this);
                    eventType(target, utils.prefixPointerEvent("pointerup"), this)
                }
                if (utils.hasTouch && !this.options.disableTouch) {
                    eventType(this.wrapper, "touchstart", this);
                    eventType(target, "touchmove", this);
                    eventType(target, "touchcancel", this);
                    eventType(target, "touchend", this)
                }
                eventType(this.scroller, "transitionend", this);
                eventType(this.scroller, "webkitTransitionEnd", this);
                eventType(this.scroller, "oTransitionEnd", this);
                eventType(this.scroller, "MSTransitionEnd", this)
            },
            getComputedPosition: function() {
                var matrix = window.getComputedStyle(this.scroller, null),
                    x, y;
                if (this.options.useTransform) {
                    matrix = matrix[utils.style.transform].split(")")[0].split(", ");
                    x = +(matrix[12] || matrix[4]);
                    y = +(matrix[13] || matrix[5])
                } else {
                    x = +matrix.left.replace(/[^-\d.]/g, "");
                    y = +matrix.top.replace(/[^-\d.]/g, "")
                }
                return {
                    x: x,
                    y: y
                }
            },
            _initWheel: function() {
                utils.addEvent(this.wrapper, "wheel", this);
                utils.addEvent(this.wrapper, "mousewheel", this);
                utils.addEvent(this.wrapper, "DOMMouseScroll", this);
                this.on("destroy", function() {
                    clearTimeout(this.wheelTimeout);
                    this.wheelTimeout = null;
                    utils.removeEvent(this.wrapper, "wheel", this);
                    utils.removeEvent(this.wrapper, "mousewheel", this);
                    utils.removeEvent(this.wrapper, "DOMMouseScroll", this)
                })
            },
            _wheel: function(e) {
                if (!this.enabled) {
                    return
                }
                e.preventDefault();
                var wheelDeltaX, wheelDeltaY, newX, newY, that = this;
                if (this.wheelTimeout === undefined) {
                    that._execEvent("scrollStart")
                }
                clearTimeout(this.wheelTimeout);
                this.wheelTimeout = setTimeout(function() {
                    if (!that.options.snap) {
                        that._execEvent("scrollEnd")
                    }
                    that.wheelTimeout = undefined
                }, 400);
                if ("deltaX" in e) {
                    if (e.deltaMode === 1) {
                        wheelDeltaX = -e.deltaX * this.options.mouseWheelSpeed;
                        wheelDeltaY = -e.deltaY * this.options.mouseWheelSpeed
                    } else {
                        wheelDeltaX = -e.deltaX;
                        wheelDeltaY = -e.deltaY
                    }
                } else if ("wheelDeltaX" in e) {
                    wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
                    wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed
                } else if ("wheelDelta" in e) {
                    wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed
                } else if ("detail" in e) {
                    wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed
                } else {
                    return
                }
                wheelDeltaX *= this.options.invertWheelDirection;
                wheelDeltaY *= this.options.invertWheelDirection;
                if (!this.hasVerticalScroll) {
                    wheelDeltaX = wheelDeltaY;
                    wheelDeltaY = 0
                }
                if (this.options.snap) {
                    newX = this.currentPage.pageX;
                    newY = this.currentPage.pageY;
                    if (wheelDeltaX > 0) {
                        newX--
                    } else if (wheelDeltaX < 0) {
                        newX++
                    }
                    if (wheelDeltaY > 0) {
                        newY--
                    } else if (wheelDeltaY < 0) {
                        newY++
                    }
                    this.goToPage(newX, newY);
                    return
                }
                newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
                newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);
                this.directionX = wheelDeltaX > 0 ? -1 : wheelDeltaX < 0 ? 1 : 0;
                this.directionY = wheelDeltaY > 0 ? -1 : wheelDeltaY < 0 ? 1 : 0;
                if (newX > 0) {
                    newX = 0
                } else if (newX < this.maxScrollX) {
                    newX = this.maxScrollX
                }
                if (newY > 0) {
                    newY = 0
                } else if (newY < this.maxScrollY) {
                    newY = this.maxScrollY
                }
                this.scrollTo(newX, newY, 0);
                if (this.options.probeType > 1) {
                    this._execEvent("scroll")
                }
            },
            _initSnap: function() {
                this.currentPage = {};
                if (typeof this.options.snap == "string") {
                    this.options.snap = this.scroller.querySelectorAll(this.options.snap)
                }
                this.on("refresh", function() {
                    var i = 0,
                        l, m = 0,
                        n, cx, cy, x = 0,
                        y, stepX = this.options.snapStepX || this.wrapperWidth,
                        stepY = this.options.snapStepY || this.wrapperHeight,
                        el;
                    this.pages = [];
                    if (!this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight) {
                        return
                    }
                    if (this.options.snap === true) {
                        cx = Math.round(stepX / 2);
                        cy = Math.round(stepY / 2);
                        while (x > -this.scrollerWidth) {
                            this.pages[i] = [];
                            l = 0;
                            y = 0;
                            while (y > -this.scrollerHeight) {
                                this.pages[i][l] = {
                                    x: Math.max(x, this.maxScrollX),
                                    y: Math.max(y, this.maxScrollY),
                                    width: stepX,
                                    height: stepY,
                                    cx: x - cx,
                                    cy: y - cy
                                };
                                y -= stepY;
                                l++
                            }
                            x -= stepX;
                            i++
                        }
                    } else {
                        el = this.options.snap;
                        l = el.length;
                        n = -1;
                        for (; i < l; i++) {
                            if (i === 0 || el[i].offsetLeft <= el[i - 1].offsetLeft) {
                                m = 0;
                                n++
                            }
                            if (!this.pages[m]) {
                                this.pages[m] = []
                            }
                            x = Math.max(-el[i].offsetLeft, this.maxScrollX);
                            y = Math.max(-el[i].offsetTop, this.maxScrollY);
                            cx = x - Math.round(el[i].offsetWidth / 2);
                            cy = y - Math.round(el[i].offsetHeight / 2);
                            this.pages[m][n] = {
                                x: x,
                                y: y,
                                width: el[i].offsetWidth,
                                height: el[i].offsetHeight,
                                cx: cx,
                                cy: cy
                            };
                            if (x > this.maxScrollX) {
                                m++
                            }
                        }
                    }
                    this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);
                    if (this.options.snapThreshold % 1 === 0) {
                        this.snapThresholdX = this.options.snapThreshold;
                        this.snapThresholdY = this.options.snapThreshold
                    } else {
                        this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
                        this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold)
                    }
                });
                this.on("flick", function() {
                    var time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(this.x - this.startX), 1e3), Math.min(Math.abs(this.y - this.startY), 1e3)), 300);
                    this.goToPage(this.currentPage.pageX + this.directionX, this.currentPage.pageY + this.directionY, time)
                })
            },
            _nearestSnap: function(x, y) {
                if (!this.pages.length) {
                    return {
                        x: 0,
                        y: 0,
                        pageX: 0,
                        pageY: 0
                    }
                }
                var i = 0,
                    l = this.pages.length,
                    m = 0;
                if (Math.abs(x - this.absStartX) < this.snapThresholdX && Math.abs(y - this.absStartY) < this.snapThresholdY) {
                    return this.currentPage
                }
                if (x > 0) {
                    x = 0
                } else if (x < this.maxScrollX) {
                    x = this.maxScrollX
                }
                if (y > 0) {
                    y = 0
                } else if (y < this.maxScrollY) {
                    y = this.maxScrollY
                }
                for (; i < l; i++) {
                    if (x >= this.pages[i][0].cx) {
                        x = this.pages[i][0].x;
                        break
                    }
                }
                l = this.pages[i].length;
                for (; m < l; m++) {
                    if (y >= this.pages[0][m].cy) {
                        y = this.pages[0][m].y;
                        break
                    }
                }
                if (i == this.currentPage.pageX) {
                    i += this.directionX;
                    if (i < 0) {
                        i = 0
                    } else if (i >= this.pages.length) {
                        i = this.pages.length - 1
                    }
                    x = this.pages[i][0].x
                }
                if (m == this.currentPage.pageY) {
                    m += this.directionY;
                    if (m < 0) {
                        m = 0
                    } else if (m >= this.pages[0].length) {
                        m = this.pages[0].length - 1
                    }
                    y = this.pages[0][m].y
                }
                return {
                    x: x,
                    y: y,
                    pageX: i,
                    pageY: m
                }
            },
            goToPage: function(x, y, time, easing) {
                easing = easing || this.options.bounceEasing;
                if (x >= this.pages.length) {
                    x = this.pages.length - 1
                } else if (x < 0) {
                    x = 0
                }
                if (y >= this.pages[x].length) {
                    y = this.pages[x].length - 1
                } else if (y < 0) {
                    y = 0
                }
                var posX = this.pages[x][y].x,
                    posY = this.pages[x][y].y;
                time = time === undefined ? this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(posX - this.x), 1e3), Math.min(Math.abs(posY - this.y), 1e3)), 300) : time;
                this.currentPage = {
                    x: posX,
                    y: posY,
                    pageX: x,
                    pageY: y
                };
                this.scrollTo(posX, posY, time, easing)
            },
            next: function(time, easing) {
                var x = this.currentPage.pageX,
                    y = this.currentPage.pageY;
                x++;
                if (x >= this.pages.length && this.hasVerticalScroll) {
                    x = 0;
                    y++
                }
                this.goToPage(x, y, time, easing)
            },
            prev: function(time, easing) {
                var x = this.currentPage.pageX,
                    y = this.currentPage.pageY;
                x--;
                if (x < 0 && this.hasVerticalScroll) {
                    x = 0;
                    y--
                }
                this.goToPage(x, y, time, easing)
            },
            _initKeys: function(e) {
                var keys = {
                    pageUp: 33,
                    pageDown: 34,
                    end: 35,
                    home: 36,
                    left: 37,
                    up: 38,
                    right: 39,
                    down: 40
                };
                var i;
                if (typeof this.options.keyBindings == "object") {
                    for (i in this.options.keyBindings) {
                        if (typeof this.options.keyBindings[i] == "string") {
                            this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0)
                        }
                    }
                } else {
                    this.options.keyBindings = {}
                }
                for (i in keys) {
                    this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i]
                }
                utils.addEvent(window, "keydown", this);
                this.on("destroy", function() {
                    utils.removeEvent(window, "keydown", this)
                })
            },
            _key: function(e) {
                if (!this.enabled) {
                    return
                }
                var snap = this.options.snap,
                    newX = snap ? this.currentPage.pageX : this.x,
                    newY = snap ? this.currentPage.pageY : this.y,
                    now = utils.getTime(),
                    prevTime = this.keyTime || 0,
                    acceleration = .25,
                    pos;
                if (this.options.useTransition && this.isInTransition) {
                    pos = this.getComputedPosition();
                    this._translate(Math.round(pos.x), Math.round(pos.y));
                    this.isInTransition = false
                }
                this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;
                switch (e.keyCode) {
                    case this.options.keyBindings.pageUp:
                        if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                            newX += snap ? 1 : this.wrapperWidth
                        } else {
                            newY += snap ? 1 : this.wrapperHeight
                        }
                        break;
                    case this.options.keyBindings.pageDown:
                        if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                            newX -= snap ? 1 : this.wrapperWidth
                        } else {
                            newY -= snap ? 1 : this.wrapperHeight
                        }
                        break;
                    case this.options.keyBindings.end:
                        newX = snap ? this.pages.length - 1 : this.maxScrollX;
                        newY = snap ? this.pages[0].length - 1 : this.maxScrollY;
                        break;
                    case this.options.keyBindings.home:
                        newX = 0;
                        newY = 0;
                        break;
                    case this.options.keyBindings.left:
                        newX += snap ? -1 : 5 + this.keyAcceleration >> 0;
                        break;
                    case this.options.keyBindings.up:
                        newY += snap ? 1 : 5 + this.keyAcceleration >> 0;
                        break;
                    case this.options.keyBindings.right:
                        newX -= snap ? -1 : 5 + this.keyAcceleration >> 0;
                        break;
                    case this.options.keyBindings.down:
                        newY -= snap ? 1 : 5 + this.keyAcceleration >> 0;
                        break;
                    default:
                        return
                }
                if (snap) {
                    this.goToPage(newX, newY);
                    return
                }
                if (newX > 0) {
                    newX = 0;
                    this.keyAcceleration = 0
                } else if (newX < this.maxScrollX) {
                    newX = this.maxScrollX;
                    this.keyAcceleration = 0
                }
                if (newY > 0) {
                    newY = 0;
                    this.keyAcceleration = 0
                } else if (newY < this.maxScrollY) {
                    newY = this.maxScrollY;
                    this.keyAcceleration = 0
                }
                this.scrollTo(newX, newY, 0);
                this.keyTime = now
            },
            _animate: function(destX, destY, duration, easingFn) {
                var that = this,
                    startX = this.x,
                    startY = this.y,
                    startTime = utils.getTime(),
                    destTime = startTime + duration;

                function step() {
                    var now = utils.getTime(),
                        newX, newY, easing;
                    if (now >= destTime) {
                        that.isAnimating = false;
                        that._translate(destX, destY);
                        if (!that.resetPosition(that.options.bounceTime)) {
                            that._execEvent("scrollEnd")
                        }
                        return
                    }
                    now = (now - startTime) / duration;
                    easing = easingFn(now);
                    newX = (destX - startX) * easing + startX;
                    newY = (destY - startY) * easing + startY;
                    that._translate(newX, newY);
                    if (that.isAnimating) {
                        rAF(step)
                    }
                    if (that.options.probeType == 3) {
                        that._execEvent("scroll")
                    }
                }
                this.isAnimating = true;
                step()
            },
            _initInfinite: function() {
                var el = this.options.infiniteElements;
                this.infiniteElements = typeof el == "string" ? document.querySelectorAll(el) : el;
                this.infiniteLength = this.infiniteElements.length;
                this.infiniteMaster = this.infiniteElements[0];
                this.infiniteElementHeight = this.infiniteMaster.offsetHeight;
                this.infiniteHeight = this.infiniteLength * this.infiniteElementHeight;
                this.options.cacheSize = this.options.cacheSize || 1e3;
                this.infiniteCacheBuffer = Math.round(this.options.cacheSize / 4);
                this.options.dataset.call(this, 0, this.options.cacheSize);
                this.on("refresh", function() {
                    var elementsPerPage = Math.ceil(this.wrapperHeight / this.infiniteElementHeight);
                    this.infiniteUpperBufferSize = Math.floor((this.infiniteLength - elementsPerPage) / 2);
                    this.reorderInfinite()
                });
                this.on("scroll", this.reorderInfinite)
            },
            reorderInfinite: function() {
                var center = -this.y + this.wrapperHeight / 2;
                var minorPhase = Math.max(Math.floor(-this.y / this.infiniteElementHeight) - this.infiniteUpperBufferSize, 0),
                    majorPhase = Math.floor(minorPhase / this.infiniteLength),
                    phase = minorPhase - majorPhase * this.infiniteLength;
                var top = 0;
                var i = 0;
                var update = [];
                var cachePhase = Math.floor(minorPhase / this.infiniteCacheBuffer);
                while (i < this.infiniteLength) {
                    top = i * this.infiniteElementHeight + majorPhase * this.infiniteHeight;
                    if (phase > i) {
                        top += this.infiniteElementHeight * this.infiniteLength
                    }
                    if (this.infiniteElements[i]._top !== top) {
                        this.infiniteElements[i]._phase = top / this.infiniteElementHeight;
                        if (this.infiniteElements[i]._phase < this.options.infiniteLimit) {
                            this.infiniteElements[i]._top = top;
                            if (this.options.infiniteUseTransform) {
                                this.infiniteElements[i].style[utils.style.transform] = "translate(0, " + top + "px)" + this.translateZ
                            } else {
                                this.infiniteElements[i].style.top = top + "px"
                            }
                            update.push(this.infiniteElements[i])
                        }
                    }
                    i++
                }
                if (this.cachePhase != cachePhase && (cachePhase === 0 || minorPhase - this.infiniteCacheBuffer > 0)) {
                    this.options.dataset.call(this, Math.max(cachePhase * this.infiniteCacheBuffer - this.infiniteCacheBuffer, 0), this.options.cacheSize)
                }
                this.cachePhase = cachePhase;
                this.updateContent(update)
            },
            updateContent: function(els) {
                if (this.infiniteCache === undefined) {
                    return
                }
                for (var i = 0, l = els.length; i < l; i++) {
                    this.options.dataFiller.call(this, els[i], this.infiniteCache[els[i]._phase])
                }
            },
            updateCache: function(start, data) {
                var firstRun = this.infiniteCache === undefined;
                this.infiniteCache = {};
                for (var i = 0, l = data.length; i < l; i++) {
                    this.infiniteCache[start++] = data[i]
                }
                if (firstRun) {
                    this.updateContent(this.infiniteElements)
                }
            },
            handleEvent: function(e) {
                switch (e.type) {
                    case "touchstart":
                    case "pointerdown":
                    case "MSPointerDown":
                    case "mousedown":
                        this._start(e);
                        break;
                    case "touchmove":
                    case "pointermove":
                    case "MSPointerMove":
                    case "mousemove":
                        this._move(e);
                        break;
                    case "touchend":
                    case "pointerup":
                    case "MSPointerUp":
                    case "mouseup":
                    case "touchcancel":
                    case "pointercancel":
                    case "MSPointerCancel":
                    case "mousecancel":
                        this._end(e);
                        break;
                    case "orientationchange":
                    case "resize":
                        this._resize();
                        break;
                    case "transitionend":
                    case "webkitTransitionEnd":
                    case "oTransitionEnd":
                    case "MSTransitionEnd":
                        this._transitionEnd(e);
                        break;
                    case "wheel":
                    case "DOMMouseScroll":
                    case "mousewheel":
                        this._wheel(e);
                        break;
                    case "keydown":
                        this._key(e);
                        break;
                    case "click":
                        if (this.enabled && !e._constructed) {
                            e.preventDefault();
                            e.stopPropagation()
                        }
                        break
                }
            }
        };
        IScroll.utils = utils;
        if (typeof module != "undefined" && module.exports) {
            module.exports = IScroll
        } else if (typeof define == "function" && define.amd) {
            define(function() {
                return IScroll
            })
        } else {
            window.IScroll = IScroll
        }
    })(window, document, Math)
});
define("xg/jx-business/1.0.0/p/commodity/goodsMng-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [4, ">= 1.0.0"];
        helpers = this.merge(helpers, Handlebars.helpers);
        data = data || {};
        var stack1, functionType = "function",
            escapeExpression = this.escapeExpression,
            self = this;

        function program1(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n<div class="goodsList">\r\n    <div class="upperBox">\r\n        <a href="/product/goodDetails/goodsDetails.htm?id=';
            if (helper = helpers.id) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.id;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" external>\r\n            <div class="upperBox-left">\r\n                <img src="';
            if (helper = helpers.zoomPicPath) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.zoomPicPath;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" alt="">\r\n            </div>\r\n            <div class="upperBox-right">            \r\n                <div class="titleFont">';
            if (helper = helpers.name) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.name;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + ' </div>\r\n                <div class="viewFont">\r\n                    <div class="money">&yen; ';
            if (helper = helpers.showPrice) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.showPrice;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + "</div>\r\n                    ";
            stack1 = helpers.unless.call(depth0, depth0 && depth0.status, {
                hash: {},
                inverse: self.program(4, program4, data),
                fn: self.program(2, program2, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += '\r\n                </div>            \r\n            </div>\r\n        </a>\r\n    </div>\r\n    <div class="downBox">\r\n        ';
            stack1 = helpers.unless.call(depth0, depth0 && depth0.status, {
                hash: {},
                inverse: self.program(8, program8, data),
                fn: self.program(6, program6, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += '\r\n        <div class="downBox-left editgoods" data-goodid="';
            if (helper = helpers.id) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.id;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">编辑</div>\r\n        <div class="downBox-right deletegoods" data-goodid="';
            if (helper = helpers.id) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.id;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">删除</div>\r\n    </div>\r\n</div>\r\n';
            return buffer
        }

        function program2(depth0, data) {
            return '\r\n                        <div class="status over">已下架</div>\r\n                    '
        }

        function program4(depth0, data) {
            return '\r\n                        <div class="status">在售</div>\r\n                    '
        }

        function program6(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n            <div class="downBox-left upgoods" data-goodid="';
            if (helper = helpers.id) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.id;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">上架</div>\r\n        ';
            return buffer
        }

        function program8(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n            <div class="downBox-left downgoods" data-goodid="';
            if (helper = helpers.id) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.id;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">下架</div>\r\n        ';
            return buffer
        }
        stack1 = helpers.each.call(depth0, depth0, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            return stack1
        } else {
            return ""
        }
    })
});