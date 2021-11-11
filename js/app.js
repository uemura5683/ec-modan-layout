( function () {
    /**
     * j closest
    */
    if ( window.Element && !Element.prototype.closest ) {
        Element.prototype.closest = function ( s ) {
            var matches = ( this.document || this.ownerDocument ).querySelectorAll( s )
              , el = this
              , i;
            do {
                i = matches.length;
                while ( --i >= 0 && matches.item( i ) !== el ) {};
            } while ( ( i < 0 ) && ( el = el.parentElement ) ); 
            return el;
        };
    }
    /**
     * initial declarate variables
     * html,
     * body,
     * wrap,
     * foot,
     * menu,
     * page,
     * main,
     * side,
     * threshold[tablet]
     * ... preset value
    */
    var html = document.documentElement
      , body = document.body
      , info = document.getElementById( 'page-information' )
      , wrap = document.getElementById( 'wrapper' )
      , head = document.getElementById( 'page-header' )
      , foot = document.getElementById( 'page-footer' )
      , menu = document.getElementById( 'drawer-menu' )
      , page = document.getElementById( 'page-body' )
      , main = page.querySelector( '.l-main' )
      , side = page.querySelector( '.l-side' )
      , threshold = 991
      , thresholdsp = 767
      , scrollTop = 0
      , gen_key = 'data-gen'
      , gt_key  = 'data-gt'
      , set_gen = 'data-set-gen-id'
      , dom_gen = 'data-gen-attr'
      , expires = 30;
    var
    trigger = function ( dom, event ) {
       if ( document.createEvent ) {
           var e = document.createEvent( 'HTMLEvents' );
           e.initEvent( event, true, true );
           return dom.dispatchEvent( e );
       }
       else {
           var e = document.createEventObject();
           return dom.fireEvent( 'on' + event, e );
       }
    },
    getSiblings = function ( node, children, className ) {
        return Array.prototype.filter.call( children, function ( v, i ) {
            return ( className )
              ? ( node !== v ) && ( className == v.className )
              : node !== v;
        } );
    },
    scrollTo = function ( dom, to, duration ) {
        if ( duration <= 0 ) {
            return;
        }
        var diff = to - dom.scrollTop
          , pert = diff / duration * 5
        setTimeout( function () {
            dom.scrollTop = dom.scrollTop + pert;
            if ( dom.scrollTop === to ) {
                return;
            }
            scrollTo( dom, to, duration - 5 );
        }, 5 );
    },
    shouldSpFunction = function () {
        return ( ( window.innerWidth || document.documentElement.clientWidth || 0 ) <= threshold );
    };
    shouldMbFunction = function () {
        return ( ( window.innerWidth || document.documentElement.clientWidth || 0 ) <= thresholdsp );
    };

    /**
     * l-drawer
     * @param  [] []
     * @return [] []
    */
    ( function () {
        if ( head && menu && wrap ) {
            var winner = wrap.querySelector( '.wrapper-inner' )
              , opener = head.querySelector( '.trigger' )
              , drawer = menu.querySelector( '.c-drawer-inner' )
              , celler = menu.querySelectorAll( '.o-util-nav' )
              , downer = menu.querySelectorAll( '.u-downer' )
              , turner = menu.querySelectorAll( '.u-return' )
              , closer = menu.querySelectorAll( '.c-drawer-ovarlay, .close-region' )
              , status = 'drawer-open'
              , lazyst = 'is-done'
              , driled = 'is-nallow';
            var erange = 20
              , startX = 0
              , startY = 0
              , X = 0
              , Y = 0
              , endX = 0
              , endY = 0;
            var
            shouldOpen = function () {
                if ( ( X === 0 && Y === 0 ) || ( endX <= erange && endY <= erange ) ) {
                    menuOpener();
                }
                startX = 0; startY = 0; X = 0; Y = 0;
                return false;
            },
            calcStartCoordinate = function ( event ) {
                startX = ( event.touches.length )
                  ? event.touches[0].pageX
                  : event.pageX;
                startY = ( event.touches.length )
                  ? event.touches[0].pageY
                  : event.pageY;
                return false;
            },
            calcMoveCoordinate = function ( event ) {
                X = ( event.touches.length )
                  ? event.touches[0].pageX
                  : event.pageX;
                Y = ( event.touches.length )
                  ? event.touches[0].pageY
                  : event.pageY;
                return false;
            },
            calcEndCoordinate = function () {
                endX = Math.abs( parseInt( startX, 10 ) - parseInt( X, 10 ) );
                endY = Math.abs( parseInt( startY, 10 ) - parseInt( Y, 10 ) );
                return false;
            },
            menuOpener = function () {
                /**
                 * @param [ scrollTop ]
                 * save for virtual scrolling
                 * cause: prevent going to top of the page by fixed content.
                */
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                winner.style.top = - scrollTop + 'px';
                body.classList.add( status );
                setTimeout( function () {
                    body.classList.add( lazyst );
                }, 80 );
                return false;
            },
            menuCloser = function () {
                body.classList.remove( lazyst );
                setTimeout( function () {
                    menuReverse();
                    drawer.scrollTop = 0;
                    winner.style.top = 'auto';
                    body.classList.remove( status );
                    window.scrollTo( 0, scrollTop );
                    body.scrollTop = scrollTop;
                    /**
                     * @param [ scrollTop ]
                     * reset for virtual scrolling
                     * cause: cant get true scrolling
                    */
                    scrollTop = 0;
                }, 160 );
                return false;
            },
            menuDrillDown = function ( node ) {
                var parent = node.parentNode
                  , ancest = parent.parentNode
                  , childs = ancest.children
                  , siblings = ( getSiblings( parent, childs ) )
                  , target = siblings.filter( function ( v, i ) {
                        return i === 0;
                    } );
                scrollTop = scrollTop
                  ? scrollTop
                  : window.pageYOffset || document.documentElement.scrollTop;
                body.classList.add( driled );
                for ( var i = 0, l = target.length; i < l; i++ ) {
                    target[i].classList.add( status );
                }
                return false;
            },
            menuReturn = function ( node ) {
                var target = node.closest( '.o-util-nav' );
                body.classList.remove( driled );
                target.classList.remove( status );
                return false;
            },
            menuReverse = function () {
                body.classList.remove( driled );
                for ( var i = 0, l = celler.length; i < l; i++ ) {
                    celler[i].classList.remove( status );
                }
                return false;
            },
            start = function ( event ) {
                event.preventDefault();
                calcStartCoordinate( event );
                return false;
            },
            moves = function ( event ) {
                event.preventDefault();
                calcMoveCoordinate( event );
                return false;
            },
            apply = function ( event ) {
                event.preventDefault();
                calcEndCoordinate( event );
                shouldOpen( event );
                return false;
            },
            close = function ( event ) {
                event.preventDefault();
                menuCloser();
                return false;
            },
            reset = function ( event ) {
                event.preventDefault();
                menuReturn( this );
                return false;
            },
            downs = function ( event ) {
                event.preventDefault();
                menuDrillDown( this )
                return false;
            };
            if ( document.ontouchstart ) {
                opener.addEventListener( 'touchstart', start, false );
                opener.addEventListener( 'touchmove',  moves, false );
                opener.addEventListener( 'touchend',   apply, false );
                for ( var i = 0, l = closer.length; i < l; i++ ) {
                    closer[i].addEventListener( 'touchstart', close, false );
                }
                for ( var i = 0, l = turner.length; i < l; i++ ) {
                    turner[i].addEventListener( 'touchstart', reset, false );
                }
            }
            else {
                opener.addEventListener( 'click', apply, false );
                for ( var i = 0, l = closer.length; i < l; i++ ) {
                    closer[i].addEventListener( 'click', close, false );
                }
                for ( var i = 0, l = downer.length; i < l; i++ ) {
                    downer[i].addEventListener( 'click', downs, false );
                }
                for ( var i = 0, l = turner.length; i < l; i++ ) {
                    turner[i].addEventListener( 'click', reset, false );
                }
            }
            window.addEventListener( 'resize', function () {
                if (! shouldSpFunction() ) {
                    if ( body.classList.contains( status ) ) {
                        menuCloser();
                    }
                }
            }, false );
        }
    } )();
    /**
     * c-filter
     * @param  [] []
     * @return [] []
    */
    ( function () {
        var filters = document.querySelectorAll( '.o-filter' )
          , winner  = wrap.querySelector( '.wrapper-inner' )
          , status  = 'drawer-open'
          , driled  = 'is-nallow'
          , dmenus  = 'dmenu-open'
          , presets = {
              'o-filter-brand': '%E3%83%96%E3%83%A9%E3%83%B3%E3%83%89%E3%82%92%E9%81%B8%E6%8A%9E%E3%81%99%E3%82%8B',
              'o-filter-category': '%E3%82%AB%E3%83%86%E3%82%B4%E3%83%AA%E3%82%92%E9%81%B8%E6%8A%9E%E3%81%99%E3%82%8B',
              'o-filter-color': '%E3%82%AB%E3%83%A9%E3%83%BC%E3%82%92%E9%81%B8%E6%8A%9E%E3%81%99%E3%82%8B',
              'o-filter-pattern': '%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3%E3%82%92%E9%81%B8%E6%8A%9E%E3%81%99%E3%82%8B',
              'o-filter-price': '%E4%BE%A1%E6%A0%BC%E3%82%92%E9%81%B8%E6%8A%9E%E3%81%99%E3%82%8B',
              'o-filter-offrate': '%E5%89%B2%E5%BC%95%E7%8E%87%E3%82%92%E9%81%B8%E6%8A%9E%E3%81%99%E3%82%8B'
            };
        var
        resetClosest = function ( event ) {
            event.preventDefault();
            var parent = this.closest( '.o-filter-region' )
              , inputs = parent.querySelectorAll( 'textarea, input, select' );
            for ( var i = 0, l = inputs.length; i < l; i++ ) {
                if ( inputs[i].name !== 'gender' ) {
                    if ( inputs[i].getAttribute( 'type' ) === 'textarea' ) {
                        inputs[i].value = '';
                    }
                    if ( inputs[i].getAttribute( 'type' ) === 'text' ) {
                        inputs[i].value = '';
                    }
                    if ( inputs[i].getAttribute( 'type' ) === 'checkbox' && inputs[i].checked ) {
                        inputs[i].checked = false;
                        trigger( inputs[i], 'change' );
                    }
                    if ( inputs[i].getAttribute( 'type' ) === 'radio' && inputs[i].checked ) {
                        inputs[i].checked = false;
                        trigger( inputs[i], 'change' );
                    }
                    if ( inputs[i].selectedIndex ) {
                        inputs[i].selectedIndex = 0;
                        trigger( inputs[i], 'change' );
                    }
                }
            }
            return false;
        },
        menuReturn = function () {
            var target = this.closest( '.o-util-nav' );
            body.classList.remove( driled );
            target.classList.remove( status );
            if ( document.getElementById( 'filter-menu' ) ) {
              var fmenu   = document.getElementById( 'filter-menu' )
                , fmenus  = fmenu.querySelector( '.c-filter-inner' );
              fmenus.classList.remove( dmenus );
            }
            if ( target.closest( '.l-main' ) ) {
                winner.style.top = 'auto';
                window.scrollTo( 0, scrollTop );
                body.scrollTop = scrollTop;
                /**
                 * @param [ scrollTop ]
                 * reset for virtual scrolling
                 * cause: cant get true scrolling
                */
                scrollTop = 0;
            }
            return false;
        },
        menuDrillDown = function ( node ) {
            var parent = node.parentNode
              , ancest = parent.parentNode
              , childs = ancest.children
              , siblings = ( getSiblings( parent, childs ) )
              , target = siblings.filter( function ( v, i ) {
                    return i === 0;
                } );
            scrollTop = scrollTop
              ? scrollTop
              : ( window.pageYOffset || document.documentElement.scrollTop );
            winner.style.top = - scrollTop + 'px';
            body.classList.add( driled );
            for ( var i = 0, l = target.length; i < l; i++ ) {
                if ( document.getElementById( 'filter-menu' ) ) {
                  var fmenu   = document.getElementById( 'filter-menu' )
                    , fmenus  = fmenu.querySelector( '.c-filter-inner' );
                  fmenus.classList.add( dmenus );
                }
                target[i].classList.add( status );
            }
            return false;
        },
        downs = function ( event ) {
            event.preventDefault();
            menuDrillDown( this )
            return false;
        },
        creatFragment = function ( node ) {
            var fragment = [];
            for ( var i = 0, l = node.length; i < l; i++ ) {
            }
            return fragment;
        },
        getNullTexts = function ( target ) {
          for ( var prop in presets ) {
              if ( presets.hasOwnProperty( prop ) ) {
                  if ( target.closest( '.form-group' ).classList.contains( prop ) ) {
                      return decodeURIComponent( presets[prop] );
                  }
              }
          }
          return null;
        },
        replaceTexts = function ( target, fragment ) {
            if ( fragment.length ) {
                target.innerHTML = fragment.join( '' );
            }
            else {
                target.innerHTML = getNullTexts( target );
            }
            return false;
        },
        switchingChecker = function ( node ) {
            var checkbox = node.closest( '.o-fold' ).querySelectorAll( 'input[type=checkbox]:not( [data-type] )' )
              , n = node.closest( '.o-fold' ).querySelector( 'input[type=checkbox][data-type]' )
              , c = Array.prototype.filter.call( checkbox, function ( v, i ) { return ( v.checked ); } )
              , d = Array.prototype.filter.call( checkbox, function ( v, i ) { return (! v.checked ); } )
            if ( node.getAttribute( 'data-type' ) === 'all' ) {
                var x = c
                  , s = n.checked
                    ? false
                    : true;
                for ( var i = 0, l = x.length; i < l; i++ ) {
                    x[i].checked = s;
                }
            }
            else {
                if ( d.length ) {
                    if ( n.checked ) {
                        n.checked = false
                    }
                }
            }
        },
        setInitCookie = function () {
            return this.checked = true;
        },
        filterSelect = function () {
            var gender = 'o-filter-gender'
              , selected = null
              , selector = [
                    '.o-filter-saletype',
                    '.o-filter-stock',
                    '.o-filter-sort'
                ]
              , targets = '.o-filter-select'
              , parents = this.closest( '.o-filter' ).querySelectorAll( selector.join( ', ' ) );

            if ( this.getAttribute( 'type' ) !== 'select' && this.checked ) {
                selected = ( this.value - 1 );
            }
            else {
                selected = this.selectedIndex;
            }
            if ( parents ) {
                for ( var i = 0, l = parents.length; i < l; i++ ) {
                    var h = parents[i].querySelectorAll( targets )
                      , v = parents[i].querySelectorAll( targets )[selected];
                    if ( h && v ) {
                        for ( var ii = 0, ll = h.length; ii < ll; ii++ ) {
                            h[ii].style.display = 'none';
                        }
                        v.style.display = 'block';
                    }
                }
            }
            return false;
        },
        contentsYield = function () {
            if ( this.closest( '.o-filter-category' ) ) {
                switchingChecker( this );
            }
            var closest = this.closest( '.cells' )
              , checked = closest.querySelectorAll( 'input[type=checkbox]:checked' )
              , target  = closest.querySelector( '.u-filter-downer' );
            replaceTexts( target, creatFragment( checked ) );
            return false;
        };
        for ( var i = 0, l = filters.length; i < l; i++ ) {
            var fgroups = filters[i].querySelectorAll( '.form-group' )
              , downer  = filters[i].querySelectorAll( '.u-filter-downer' )
              , genders = filters[i].querySelectorAll( 'select[name=gender]' )
              , rgender = filters[i].querySelectorAll( 'input[name=gender]' )
              , checker = filters[i].querySelectorAll( 'input[type=checkbox]' )
              , reset   = filters[i].querySelectorAll( 'input[type=reset]' )
              , determ  = filters[i].querySelectorAll( 'input[type=button]' )
              , ureturn = filters[i].querySelectorAll( '.u-return' );
            for ( var ii = 0, ll = checker.length; ii < ll; ii++ ) {
                checker[ii].addEventListener( 'change', contentsYield, false );
            }
            for ( var ii = 0, ll = rgender.length; ii < ll; ii++ ) {
                rgender[0].addEventListener( 'load', setInitCookie, false );
                trigger( rgender[0], 'load' );
                rgender[ii].addEventListener( 'change', filterSelect, false );
                trigger( rgender[ii], 'change' );
            }
            for ( var ii = 0, ll = genders.length; ii < ll; ii++ ) {
                genders[ii].addEventListener( 'change', filterSelect, false );
                trigger( genders[ii], 'change' );
            }
            for ( var ii = 0, ll = downer.length; ii < ll; ii++ ) {
                downer[ii].addEventListener( 'click', downs, false );
            }
            for ( var ii = 0, ll = reset.length; ii < ll; ii++ ) {
                reset[ii].addEventListener( 'click', resetClosest, false );
            }
            for ( var ii = 0, ll = determ.length; ii < ll; ii++ ) {
                determ[ii].addEventListener( 'click', menuReturn, false );
            }
            for ( var ii = 0, ll = ureturn.length; ii < ll; ii++ ) {
                ureturn[ii].addEventListener( 'click', menuReturn, false );
            }
        }
    } )();
    /**
     * c-gender
     * @param  [] []
     * @return [] []
    */
    ( function () {
        var anchors  = menu.querySelectorAll( '[' + set_gen + ']' )
          , selector = document.querySelectorAll( 'select[name=gender]' )
          , geninput = document.querySelectorAll( 'input[name=gender]' )
          , follower = document.querySelectorAll( '[' + dom_gen + ']' + ' ' + 'input[type=checkbox]' )
          , bnrgen   = document.querySelectorAll( '.banner-region-inner' )
          , status   = 'active';
        var
        setCookie = function ( key, value ) {
            washOut();
            jQuery.cookie( key, value, { expires: expires } );
        },
        changeStatus = function ( dom ) {
            for ( var i = 0, l = anchors.length; i < l; i++ ) {
                anchors[i].classList.remove( status );
            }
            dom.classList.add( status );
            return false;
        },
        washOut = function () {
            for ( var i = 0, l = follower.length; i < l; i++ ) {
                if ( follower[i].checked ) {
                    follower[i].checked = false;
                    trigger( follower[i], 'change' );
                }
            }
            return false;
        },
        stageSet = function () {
            setCookie( gen_key, this.value );
        },
        bnrload = function ( event ) {
            if ( this.classList.contains( 'active' ) ) {
              for ( var i = 0, l = bnrgen.length; i < l; i++ ) {
                  if ( this.getAttribute( set_gen ) == bnrgen[i].getAttribute( dom_gen ) ) {
                      bnrgen[i].style.display = 'block';
                  } else {
                      bnrgen[i].style.display = 'none';
                  }
              }
            }
            return false;
        },
        bnrchange = function ( dom ) {
            if ( dom.classList.contains( 'active' ) ) {
              for ( var i = 0, l = bnrgen.length; i < l; i++ ) {
                  if ( dom.getAttribute( set_gen ) == bnrgen[i].getAttribute( dom_gen ) ) {
                      bnrgen[i].style.display = 'block';
                  } else {
                      bnrgen[i].style.display = 'none';
                  }
              }
            }
            return false;
        },
        exchange = function ( event ) {
            event.preventDefault();
            changeStatus( this );
            bnrchange( this );
            return false;
        };
        /**
         * humberger menu: gender chain
         * button & selector
        */
        for ( var i = 0, l = anchors.length; i < l; i++ ) {
            anchors[i].addEventListener( 'click', exchange, false );
            anchors[i].addEventListener( 'load', bnrload, false );
            trigger( anchors[i], 'load' );
        }
        for ( var i = 0, l = selector.length; i < l; i++ ) {
            selector[i].addEventListener( 'change', stageSet, false );
        }
        for ( var i = 0, l = geninput.length; i < l; i++ ) {
            geninput[i].addEventListener( 'change', stageSet, false );
        }
    } )();
    /**
     * c-change
     * @param  [] []
     * @return [] []
    */
    ( function () {
        var filters = document.querySelectorAll( '.f-layout' );
        if ( filters ) {
            var
            changeText = function () {
                var opts = this.options[this.selectedIndex]
                  , text = opts.text
                  , prev = this.previousElementSibling;
                if ( prev ) {
                    prev.innerHTML = text;
                }
                return this.blur();
            };
            for ( var i = 0, l = filters.length; i < l; i++ ) {
                filters[i].addEventListener( 'load', changeText, false );
                filters[i].addEventListener( 'change', changeText, false );
            }
        }
    } )();
    /**
     * c-filter-remodal
     * @param  [ lib ] [ jQuery ]
     * @return [ lib ] [ remodal ]
    */
    ( function () {
        var winner = wrap.querySelector( '.wrapper-inner' )
          , modals = '.filter-menu.remodal'
          , status = 'drawer-open'
        jQuery( document ).on( 'opening', modals, function () {
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            winner.style.top = - scrollTop + 'px';
            body.classList.add( status );
        });
        jQuery( document ).on( 'closing', modals, function () {
            winner.style.top = 'auto';
            body.classList.remove( status );
            window.scrollTo( 0, scrollTop );
            body.scrollTop = scrollTop;
        });
    } )();

} )();