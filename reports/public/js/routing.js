var router;
var routing = function (mode) {
    router = new Navigo(null, mode === 'hash');
    router.on({
        '/home': function () {
            $('#navbar a.home').parent().addClass('active');
            $(document).ready(function () {
                var html = '<table id="datatbl" class="display" cellspacing="0" width="100%"><thead><tr><th>Metric Profile</th><th>Action</th><th>Actor</th><th>Time</th><th>&nbsp;</th></tr></thead></table>';
                $('#container').html(html);
                $('#datatbl').DataTable({
                    "ajax": {
                        "url": "event.php"
                    },
                    "columns": [
                        {"data": "profile"},
                        {"data": "action"},
                        {"data": "actor"},
                        {"data": "event_time"},
                        {"data": "full"}
                    ],
                    "order": [[3, "asc"]],
                    aoColumnDefs: [
                        {
                            bSortable: false,
                            aTargets: [ -1 ]
                        }
                    ],
                    "ordering": true,
                    "searching": false,
                    "bProcessing": true,
                    "bServerSide": true,
                    "drawCallback": function (settings) {
                        $('a.other').on('click', function () {
                            $('.modal-body').html('<pre>' + JSON.stringify(JSON.parse($(this).prev().val()), null, 2) + '</pre>');
                            $('a.js-open-modal.btn').click();
                        });
                    }
                });
            });
        },
        'weekly-session-other': function () {
            callAjaxForGraph('weekly-session-other');
        },
        'weekly-session': function () {
            callAjaxForGraph('weekly-session');
        },
        'weekly-course': function () {
            callAjaxForGraph('weekly-course');
        },
        'book-view': function(){
            callAjaxForGraph('book-view');
        },
        'student-activity': function(){
            callAjaxForGraph('student-activity');
        },
        'student-session': function(){
            callAjaxForGraph('student-session');
        },
        'question-complexity': function(){
            callAjaxForGraph('question-complexity');
        },
        'this/*/:language/:what': function (params) {
            var id = 'parameterized';
            var content = el('#content-' + id).innerHTML;

            Object.keys(params).forEach(function (key) {
                content = content.replace(new RegExp('{{' + key + '}}', 'g'), params[key]);
            });
            setContent(id, content);
        },
        'test-case/*': function () {},
        'testing': function () {
            var id = 'testing';

            setContent(id, el('#content-' + id).innerHTML);
            mocha.run();
        }
    });
    router.on(function () {
        setContent('about');
    });
    router.resolve();
};

var el = function (sel) {
    return document.querySelector(sel);
}

var setContent = function (id, content) {
//    el('#container').innerHTML = content || el('#content-' + id).innerHTML;
};

var switchModes = function () {
    var trigger = el('.js-mode-trigger');
    var mode = 'history-api';
    var isLocalStorageSupported = !!window.localStorage;
    var rerenderTrigger = function (mode) {
        trigger.querySelector('input').checked = mode === 'hash';
    };

    if (isLocalStorageSupported) {
        mode = localStorage.getItem('navigo') || mode;
    }
    rerenderTrigger(mode);

    trigger.addEventListener('click', function () {
        mode = mode === 'history-api' ? 'hash' : 'history-api';
        isLocalStorageSupported && localStorage.setItem('navigo', mode);
        window.location.href = (router.root || '').replace('#', '');
        setTimeout(function () {
            window.location.reload(true);
        }, 200);
    });

    return mode;
};

var init = function () {
    routing();
};

function navigate(url){
    router.navigate(url);
}

window.onload = init;