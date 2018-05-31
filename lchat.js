$(function () {

    // 最简单写法.
    t.init({
        pageId: 'l-chat-main',
        baseURL: 'http://wx.wit-learn.com',
        auidObj: {
            auidKey: 'App',
            auidValue: '20160420_1055'
        },
        isDesktop: true
    }); // End t.init

    // 聊天内容 --- div
    var LchatContent = $('#l-chat-content');
    // 发送按钮
    var LchatSend = $('#l-chat-send');
    // 聊天内容 --- ul
    var LchatContentUl = $('#l-chat-content ul');
    // 输入框内容 --- textarea
    var LchatTextarea = $('#l-chat-textarea');

    var Lapi = '/subProgApi/private/searchMessageDetail';

    var LpageIndex = 0;
    var LmeaageArr = [];

    LchatContent.css({
        'height': document.body.clientHeight - 110
    });



    // 绑定滚轮事件
    LchatContent.on('mousewheel', LscrollXHR);

    // 滚轮执行的函数
    function LscrollXHR(event, delta) {

        if ($(this).scrollTop() === 0 && delta === 1) {

            $(this).unbind('mousewheel');

            console.log('滚轮上滚请求数据');

            // 页码叠加
            LpageIndex ++;

            LmessageXHR({
                pageIndex: LpageIndex

            }, function (data) {

                // 请求到数据判断数据条数是否到达上限
                if (LpageIndex > Math.ceil(data.returnObject.total / 10)) {

                    console.log('数量上限了');
                    LpageIndex = 3;
                    t.showMessage('已经没有消息了!');
                    LchatContent.on('mousewheel', LscrollXHR);
                    return;
                }

                console.log(data, '-----');

                // 总的消息数组
                LmeaageArr = LmeaageArr.concat(data.returnObject.list);

                // 循环添加div
                LmeaageArr.forEach(function (item, index) {
                    if (item.toUserId) {
                        LappendContent(LchatContent, item, 'he');
                    } else {
                        LappendContent(LchatContent, item);
                    }

                });
                LchatContent.scrollTop('200');

                LchatContent.on('mousewheel', LscrollXHR);
            }, function (error) {

                LpageIndex--;
                console.log(error);
                LchatContent.on('mousewheel', LscrollXHR);
            });

        }
    }



    // ----------------------------------- function ---------------------
    // 点击发送按钮
    LchatSend.on('click', function (e) {
        // e.stopPropagation();
        console.log('发送聊天内容');


        LappendContent(LchatContent, {
            messageContent: LchatTextarea.val()
        });

        

        

        // 每次输入完后, 设为空
        LchatTextarea.val('');
    });


    // 发送消息给老师函数, 具体参数未设置
    function LsendMessageXHR(obj, successfn, errorfn) {
        
        if (obj && typeof obj === 'function') {

            errorfn = successfn;
            successfn = obj;
            obj = {};
        }

        t.ajax({
            type: 'GET',
            url: Lapi,
            data: {
                // 这里设置请求参数
            },
            timeout: 5000,
            handleError: true
        }, function (data) {

            successfn(data);
        }, function (error) {

            errorfn(error);
        });


    }

    function LmessageXHR(obj, successfn, errorfn) {

        if (obj && typeof obj === 'function') {

            errorfn = successfn;
            successfn = obj;
            obj = {};
        }

        t.ajax({
            type: 'GET',
            url: Lapi,
            data: {
                userId: obj.userId || 4, // 学生ID暂时固定
                pageIndex: obj.pageIndex || 1,
                pageSize: 10
            },
            timeout: 5000,
            handleError: true
        }, function (data) {

            successfn(data);
        }, function (error) {

            errorfn(error);
        });

    }

    // 添加 模板 函数
    function LappendContent(target, obj, he = 'me') {

        // 3个判断, 如果无数据则显示测试内容
        obj = obj || {};
        obj.createTimestamp = obj.createTimestamp || '2018-05-30 17:51:58';
        obj.messageContent = obj.messageContent || '测试内容';


        var imgurl = '';
        // 判断头像是否为自己, 默认自己
        he == 'me' ? imgurl = '101.jpg' : imgurl = '100.jpg';

        // 模板
        var tempStr = '<li class="l-chat-' + he + '"><div id="l-chat-listtitle"><p id="l-chat-time">' +
            obj.createTimestamp + '</p><img src="./' + imgurl +
            '" alt=""></div><div id="l-chat-listcont">' + obj.messageContent + '</div></li>';
        // 把拼好的模板字符串追加到UL中
        target.append(tempStr);
        // 滚动条滚动到底部
        // LgotoBottom(target);

        // 返回innerHTML, 可有可无
        return tempStr;
    }

    // 滚动条滚动到底部, target为jQuery对象, 非jQuery对象报错
    function LgotoBottom(target) {

        target[0].scrollTop = target[0].scrollHeight;
    }

});