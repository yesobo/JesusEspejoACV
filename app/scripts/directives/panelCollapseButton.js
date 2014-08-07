/* global $ */
/*jshint camelcase: false */
'use strict';

angular.module('PanelCollapseButtonDirective', [])
    .directive('jeaCollapseButton', function() {

        function makeSticky(jElement, jParent) {
            jElement.stick_in_parent({
                offset_top: 50,
                parent: jParent,
            }).on("sticky_kit:stick", function(e) {
                console.log('scroll pos: ' + $(document).scrollTop());
                collapseScrollTop = $(document).scrollTop();
            }).on("sticky_kit:unstick", function(e) {
                console.log('unstuck');
            });
        }

        function unbindSticky(jElement) {
            jElement.off("sticky_kit:stick").off("sticky_kit:unstick");
        }

        return {
            restrict: 'A',
            // TODO: add collapseScrollTop to isolated scope
            scope: true,
            link: function(scope, elem) {
                var jPanel = $(elem[0].parentElement.parentElement);
                var stickyZone = jPanel.children('.stickyZone');
                var panelHeader = stickyZone.children('.panel-heading');
                jPanel.on('shown.bs.collapse', function() {
                    makeSticky(panelHeader, stickyZone);
                    $(document.body).trigger('sticky_kit:recalc');
                });
                jPanel.on('hidden.bs.collapse', function() {
                    unbindSticky(panelHeader);
                    //window.scrollTo(0, collapseScrollTop);
                    $(document.body).trigger('sticky_kit:recalc');
                    // commented because of sticky-kit issue #23
                    //panelHeader.trigger('sticky_kit:detach');
                });
            }
        };
    });