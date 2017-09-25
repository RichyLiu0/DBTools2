$(function () {

    $("table[fixtable]").each(function () {
        var fixtable = $(this);
        var id = fixtable.attr('id');
        if (!id) {
            id = getFixId();
            fixtable.attr('id', id);
        }

        var fixAttrs = parseAggAttr(fixtable.attr('fixtable'));

        FixTable(
            id, fixAttrs.column,
            fixAttrs.width, fixAttrs.height);
    });


})

/// <summary>
///     ������ͷ����
///     <para> sorex.cnblogs.com </para>
/// </summary>
/// <param name="TableID" type="String">
///     Ҫ������Table��ID
/// </param>
/// <param name="FixColumnNumber" type="Number">
///     Ҫ�����еĸ���
/// </param>
/// <param name="width" type="Number">
///     ��ʾ�Ŀ��
/// </param>
/// <param name="height" type="Number">
///     ��ʾ�ĸ߶�
/// </param>
function FixTable(tableID, fixColumnNumber, width, height) {

    var tableLayout = $("#" + tableID + "_tableLayout");
    var oldtable = $("#" + tableID);

    if (!width) {
        width = oldtable.width();

        var docWidth = document.body.clientWidth - 36;
        if (width > docWidth) {
            width = docWidth;
        }

    }
    if (!height) {
        height = oldtable.height() + 15;
    }

    if (!fixColumnNumber) {
        fixColumnNumber = 3;
    }

    if (tableLayout.length != 0) {
        tableLayout.before(oldtable);
        tableLayout.empty();
    }
    else {

        var tableLayout = $('<div/>').attr('id', tableID + "_tableLayout");
        tableLayout.css(
            {
                'overflow': 'hidden',
                'height': height, 'width': width
            }
            );

        oldtable.after(tableLayout);
    }

    $(
    '<div id="' + tableID + '_tableColumn"></div>'
    + '<div id="' + tableID + '_tableData"></div>')
        .appendTo(tableLayout);



    //������ʾ�����е�


    var tableColumnClone = oldtable.clone(true);
    tableColumnClone.attr("id", tableID + "_tableColumnClone");
    var tableColumnPanel = $("#" + tableID + "_tableColumn");
    tableColumnPanel.append(tableColumnClone);


    var tableDataPanel = $("#" + tableID + "_tableData");
    tableDataPanel.append(oldtable);


    //��������
    var floatfixedPanel = tableDataPanel;//ԭ����
    //�̶���ʾ����
    var lockedPanel = tableColumnPanel;


    //�������Ƿ��в�������
    var checkboxs = tableColumnPanel.find("input:checkbox");
    if (checkboxs) {
        //ȥ������Ĳ�����
        checkboxs.each(function () {
            $(this).attr(
                {
                    'class': '',
                    'id': '',
                    'name': '',
                    'dsisabled': 'disabled'
                });
        });
    }




    $("#" + tableID + "_tableLayout table").each(function () {
        $(this).css("margin", "0");
    });



    var columnsWidth = 0;
    var columnsNumber = 0;
    floatfixedPanel.find("tr:last td:lt(" + fixColumnNumber + ")").each(function () {
        columnsWidth += $(this).outerWidth(true);
        columnsNumber++;
    });
    columnsWidth += 2;
    if ($.browser.msie) {
        switch ($.browser.version) {
            case "7.0":
                if (columnsNumber >= 3) columnsWidth--;
                break;
            case "8.0":
                if (columnsNumber >= 2) columnsWidth--;
                break;
        }
    }


    floatfixedPanel.css("width", columnsWidth);

    lockedPanel.scroll(function () {
        floatfixedPanel.scrollTop(lockedPanel.scrollTop());
    });


    //height - 17,��ʾ���������
    floatfixedPanel.css(
        {
            "overflow": "hidden",
            "height": height - 17, "position": "relative",
            "z-index": "40", "background-color": "white"
        }
        );
    lockedPanel.css(
        {
            "overflow": "scroll", "width": width,
            "height": height, "position": "relative", "z-index": "35"
        }
        );


    floatfixedPanel.offset(tableLayout.offset());
    lockedPanel.offset(tableLayout.offset());
}



function parseAggAttr(value) {
    var attrs = {};

    if (!value) {
        return attrs;
    }

    var attrsTemp = value.split(';');

    for (var i = 0; i < attrsTemp.length; i++) {
        var c = '';
        c = attrsTemp[i].split(':');
        attrs[$.trim(c[0])] = $.trim(c[1]);
    }

    return attrs;
}


function getFixId() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "";
    }
    return guid;
}


