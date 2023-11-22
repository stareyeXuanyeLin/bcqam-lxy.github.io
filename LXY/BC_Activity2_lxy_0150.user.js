(function () {
    'use strict';

    const remoteScriptURL = 'https://gitlab.com/Echo_87150/activity/-/raw/main/BC_Activity.user.js';

    GM_xmlhttpRequest({
        method: 'GET',
        url: remoteScriptURL,
        onload: function (response) {
            if (response.status === 200) {
                const remoteScriptContent = response.responseText;

                const script = document.createElement('script');
                script.textContent = remoteScriptContent;

                document.head.appendChild(script);

                console.log('活动拓展已成功加载并注入到页面！');
            } else {
                console.error('加载远程脚本失败：', response.status, response.statusText);
            }
        },
        onerror: function (error) {
            console.error('加载远程脚本时发生错误：', error);
        }
    });
})();
