/**
 *  We handle several device classes based on browser width.
 *
 *  - desktop:   > __tablet_width__ (as set in style.ini)
 *  - mobile:
 *    - tablet   <= __tablet_width__
 *    - phone    <= __phone_width__
 */
var device_class = ''; // not yet known
var device_classes = 'desktop mobile tablet phone';

function tpl_dokuwiki_mobile(){

    // the z-index in mobile.css is (mis-)used purely for detecting the screen mode here
    var screen_mode = jQuery('#screen__mode').css('z-index') + '';

    // determine our device pattern
    // TODO: consider moving into dokuwiki core
    switch (screen_mode) {
        case '1':
            if (device_class.match(/tablet/)) return;
            device_class = 'mobile tablet';
            break;
        case '2':
            if (device_class.match(/phone/)) return;
            device_class = 'mobile phone';
            break;
        default:
            if (device_class == 'desktop') return;
            device_class = 'desktop';
    }

    jQuery('html').removeClass(device_classes).addClass(device_class);

    // handle some layout changes based on change in device
    var $handle = jQuery('#dokuwiki__aside h3.toggle');
    var $toc = jQuery('#dw__toc h3');

    if (device_class == 'desktop') {
        // reset for desktop mode
        if($handle.length) {
            $handle[0].setState(1);
            $handle.hide();
        }
        if($toc.length) {
            $toc[0].setState(1);
        }
    }
    if (device_class.match(/mobile/)){
        // toc and sidebar hiding
        if($handle.length) {
            $handle.show();
            $handle[0].setState(-1);
        }
        if($toc.length) {
            $toc[0].setState(-1);
        }
    }
}

jQuery(function(){
    var resizeTimer;
    dw_page.makeToggle2 = function (handle, content, state) {
        var $handle,
            $content,
            $clicky,
            $child,
            setClicky;
        $handle = jQuery(handle);
        if (!$handle.length) return;
        $content = jQuery(content);
        if (!$content.length) return;
        $child = $content.children().filter(":not(script)");
        setClicky = function (hiding) {
            if (hiding) {
                $clicky.html('<span>+</span>');
                $handle.addClass('closed');
                $handle.removeClass('open');
            } else {
                $clicky.html('<span>−</span>');
                $handle.addClass('open');
                $handle.removeClass('closed');
            }
        };
        $handle[0].setState = function (state) {
            var hidden;
            if (!state) state = 1;
            $content.css('min-height', $content.height()).show();
            $child.stop(true, true);
            if (state === - 1) {
                hidden = false;
            } else if (state === 1) {
                hidden = true;
            } else {
                hidden = $child.is(':hidden');
            }
            setClicky(!hidden);
            $child.dw_toggle(hidden, function () {
                $content.toggle(hidden);
                $content.css('min-height', '');
            });
        };
        $clicky = jQuery(document.createElement('strong'));
        $handle.css('cursor', 'pointer').click($handle[0].setState).prepend($clicky);
        $handle[0].setState(state);
    };
    dw_page.makeToggle2('#dokuwiki__aside h3.toggle','#dokuwiki__aside div.content');

    tpl_dokuwiki_mobile();
    jQuery(window).bind('resize', function(){
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(tpl_dokuwiki_mobile,200);
    });

    // increase sidebar length to match content (desktop mode only)
    var $sidebar = jQuery('.desktop #dokuwiki__aside');
    if($sidebar.length) {
        var $content = jQuery('#dokuwiki__content div.page');
        $content.css('min-height', $sidebar.height());
    }
});
