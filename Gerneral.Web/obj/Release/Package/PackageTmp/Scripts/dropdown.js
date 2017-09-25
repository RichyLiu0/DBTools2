
/**

*
* @descript：
* 自定义下拉框，类型有：
*      普通的单选Select、带chckbox的多选Select
*      下拉出树型菜单、日期选择
*/
function Dropdown(textObj) {
    this.srcObj = textObj;
}
Dropdown.prototype = {
    dropdownId: '__dropdown',
    valueName: '_ddName',
    splitChar: '|',
    dropdownImage: 'dropdown.png',
    options: new Array(),
    multiple: false,
    focusColor: "#DDDDDD",
    setLoader: function (dd) {
        this.loader = dd;
        this.toUI();
    },
    toUI: function () {
        var html = "<span id='" + this.dropdownId + "' style='position:absolute;background-color:ghostwhite;border:solid 1px #88AACC;visibility:hidden;'></span>";
        this.srcObj.insertAdjacentHTML("AfterEnd", html);
        this.dispObj = this.srcObj.nextSibling;
        html = "<img src='" + this.dropdownImage + "' height='23' width='14' border=0 align='absMiddle' onclick='" + this.loader + ".show();'>";
        this.srcObj.insertAdjacentHTML("AfterEnd", html);
        this.arrowImg = this.srcObj.nextSibling;
        this.srcObj.insertAdjacentHTML("AfterEnd", "<input type='hidden' search='" + this.valueName + "' name='" + this.valueName + "' id='" + this.valueName + "'>");
        this.valueObj = this.srcObj.nextSibling;
    },
    show: function () {
        if (this.dispObj.style.visibility == "hidden") {
            this.getShowStr();
            this.initSelectedItem();
            var pxy = getOffsetPosition(this.srcObj);
            var bodyHeight = document.body.clientHeight + document.body.clientTop;
            var top_ = pxy.y + this.srcObj.offsetHeight;
            var offset = -1;
            with (this.dispObj.style) {
                zIndex = 9999;
                visibility = "visible";
                width = this.srcObj.offsetWidth + this.arrowImg.offsetWidth;
                pixelLeft = pxy.x;
                if (top_ + height + document.body.scrollTop > bodyHeight) {
                    pixelTop = pxy.y - height;
                } else {
                    pixelTop = top_ + offset;
                }
            }
        } else {
            this.hide();
        }
        event.cancelBubble = true;
    },
    hide: function () {
        this.dispObj.style.visibility = "hidden";
        if (this.multiple) {


            var children = this.dispObj.childNodes;
            var value = "";
            var text = "";
            for (var i = 0, len = children.length; i < len; i++) {
                if (children[i].childNodes[0].checked) {
                    value += children[i].getAttribute('value') + this.splitChar;
                    text += children[i].getAttribute('text') + this.splitChar;
                }
            }
            if (value != "") {
                value = value.substring(0, value.length - 1);
                text = text.substring(0, text.length - 1);

            } else {
                var d = document.getElementById(this.dropdownId);
                if (d.innerHTML == "") {
                    this.valueObj.value = document.getElementById(this.valueName).value;
                    this.srcObj.value = this.srcObj.value;
                    return;
                }
            }
            this.valueObj.value = value;
            this.srcObj.value = text;


        }
    },
    addItem: function (text_, value_) {
        var item = { value: value_, text: text_ };
        this.options.push(item);
    },
    push: function (item) {
        this.options.push(item);
    },
    addItems: function (json) {
        var items = eval('(' + json + ')');
        for (var i = 0; i < items.length; i++) {
            this.options.push(items[i]);
        }
    },
    getValue: function () {
        return this.valueObj.value;
    },
    setMultiple: function (flag) {
        this.multiple = flag;
    },
    /**重载这个方法可以实现树结构**/
    getShowStr: function () {
        var html = "";
        var uid = GetGUID();
        for (var i = 0, len = this.options.length; i < len; i++) {
            var cbxId = uid + "_" + i;
            html += "<div style='border-bottom: solid 1px #AADDFF;width:100%;height:20px;margin:2px 2px 2px 2px;' value=\"" + this.options[i].value + "\" text=\"" + this.options[i].text + "\" "
                 + "onMouseOver=\"this.style.backgroundColor='" + this.focusColor + "'\" onMouseOut=\"this.style.backgroundColor='transparent'\" "
                 + "onclick=\"" + this.loader + ".selectItemOK(this)\">";
            if (this.multiple) {
                html += "<input type='checkbox' id='" + cbxId + "'>";
            }
            html += "<label for='" + cbxId + "'>" + this.options[i].text + "</label></div>";
        }
        this.dispObj.innerHTML = html;
        if (this.options.length == 0) {
            this.dispObj.style.height = 100;
        } else {
            var height = 0;
            var children = this.dispObj.childNodes;
            for (var i = 0, len = children.length; i < len; i++) {
                height += children[i].offsetHeight;
            }
            this.dispObj.style.height = height;
        }
    },
    /**private*/

    /**private**/
    selectItemOK: function (element) {
        if (this.multiple) {

            //    element.childNodes[0].click();

            event.cancelBubble = true;
            if (this.multiple) {
                var children = this.dispObj.childNodes;
                var value = "";
                var text = "";
                for (var i = 0, len = children.length; i < len; i++) {
                    if (children[i].childNodes[0].checked) {
                        value += children[i].getAttribute('value') + this.splitChar;
                        text += children[i].getAttribute('text') + this.splitChar;
                    }
                }
                if (value != "") {
                    value = value.substring(0, value.length - 1);
                    text = text.substring(0, text.length - 1);

                } else {
                    var d = document.getElementById(this.dropdownId);
                    if (d.innerHTML == "") {
                        this.valueObj.value = document.getElementById(this.valueName).value;
                        this.srcObj.value = this.srcObj.value;
                        return;
                    }
                }
                this.valueObj.value = value;
                this.srcObj.value = text;
            }
        } else {
            this.srcObj.value = element.innerText;
            this.valueObj.value = element.value;
            event.cancelBubble = false;
        }
        this.selectedIndex = undefined;
    },
    /**private**/
    initSelectedItem: function () {
        var values = this.getValue();
        if (values == "")
            values = this.selectedIndex;
        /*
        if (values == "" || values == undefined)
        values = document.getElementById(this.valueName).value;
        */
        if (values != "" && values != undefined) {
            values = values.split(this.splitChar);
            for (var i = 0, len = this.options.length; i < len; i++) {
                for (var j = values.length - 1; j >= 0; j--) {
                    if (values[j] == this.options[i].value) {
                        this.focusItem(i);
                        if (!this.multiple) {
                            break;
                        }
                    }
                }
            }
        }
        /*
        if (this.selectedIndex != undefined){
        this.focusItem(this.selectedIndex);
        }
        */
    },
    /**private-private**/
    focusItem: function (index) {
        this.dispObj.childNodes[index].style.backgroundColor = this.focusColor;
        if (this.multiple) {
            this.dispObj.childNodes[index].childNodes[0].checked = true;
        } else {
            this.srcObj.value = this.dispObj.childNodes[index].innerText;
        }
    }
};

/**import ElementUtils.js*/
function getOffsetPosition(src) {
    var left = 0, top = 0;
    while (src.offsetParent) {
        left += src.offsetLeft;
        top += src.offsetTop;
        src = src.offsetParent;
    }
    return new Point(left, top);
};
function Point(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.type = "Point";
}
function GetGUID() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    return guid;
}
/*import end*/