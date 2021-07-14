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
     * l-sticky
     * @param  [] []
     * @return [] []
    */
    ( function () {
        if ( head ) {
            var pagtop = window.pageYOffset || document.documentElement.scrollTop
              , sticky = head.querySelector( '.u-fixed-wrapper' )
              , lower  = head.querySelector( '.c-header-lower' )
              , spreg  = ( head.getBoundingClientRect().top + pagtop )
              , pcreg  = ( lower.getBoundingClientRect().top + pagtop )
              , status = 'is-fixed'
              , timer  = false
              , scroll = 0;
            var
            observer = function () {
                scroll = ( window.pageYOffset || document.documentElement.scrollTop );
                if ( (! scroll ) && scrollTop ) {
                    scroll = scrollTop;
                }
                if ( calculate() ) {
                    if ( calculate() == 0 || calculate() > head.clientHeight ) {
                        (! shouldSpFunction() )
                            ? headerHeight = 175
                            : headerHeight = 60;
                        pagtop = scroll;  
                        pagtop >= headerHeight
                            ? execute()
                            : restore();
                    } else {
                        pagtop = scroll;
                        pagtop >= calculate()
                            ? execute()
                            : restore();
                    }
                }
                else { 
                    (! shouldSpFunction() )
                        ? headerHeight = 175
                        : headerHeight = 60;
                    pagtop = scroll;  
                    pagtop >= headerHeight
                        ? execute()
                        : restore();
                }
                return false;
            },
            calculate = function () {
                return ( sticky )
                  ? ( shouldSpFunction() )
                      ? spreg
                      : pcreg
                  : 0;
            },
            execute = function () {
                return ( sticky )
                  ? sticky.classList.add( status )
                  : false;
            },
            restore = function () {
                return ( sticky )
                  ? sticky.classList.remove( status )
                  : false;
            },
            apply = function () {
                observer();
            },
            timer = function () {
                if ( timer ) {
                    clearTimeout( timer );
                }
                timer = setTimeout( function () {
                    apply();
                }, 200 );
            };
            window.addEventListener( 'scroll', apply, false );
            window.addEventListener( 'resize', timer, false );
        }
    } )();
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
                        return ( jQuery.cookie( gen_key ) && v.getAttribute( dom_gen ) )
                          ? v.getAttribute( dom_gen ) === jQuery.cookie( gen_key )
                          : i === 0;
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
                    return ( jQuery.cookie( gen_key ) && v.getAttribute( dom_gen ) )
                      ? v.getAttribute( dom_gen ) === jQuery.cookie( gen_key )
                      : i === 0;
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
                var yiels = node[i].nextSibling.querySelector( '.yield' ).textContent
                  , span  = document.createElement( 'span' )
                  , lyric = document.createTextNode( yiels );
                span.appendChild( lyric );
                fragment.push( span.outerHTML );
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
          if( jQuery.cookie( gen_key ) ) {
            return ( jQuery.cookie( gen_key ) === this.value )
              ? this.checked = true
              : this.checked = false;
          } else {
            return this.checked = true;
          }
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
                if ( jQuery.cookie( gen_key ) !== null ) {              
                    rgender[ii].addEventListener( 'load', setInitCookie, false );
                    trigger( rgender[ii], 'load' );
                } else {
                    rgender[0].addEventListener( 'load', setInitCookie, false );
                    trigger( rgender[0], 'load' );
                }
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
        changeGender = function ( dom ) {
            for ( var i = 0, l = selector.length; i < l; i++ ) {
                selector[i].options.selectedIndex = ( dom.getAttribute( set_gen ) - 1 );
                trigger( selector[i], 'change' );
            }
            setCookie( gen_key, dom.getAttribute( set_gen ) );
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
            changeGender( this );
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
     * c-slide-wrap
     * @param  [] []
     * @return [] []
    */
    ( function () {
        var headings = document.querySelectorAll( '.c-slide-wrap .heading' )
          , duration = 500
          , status = 'active';
        var
        ovserver = function ( event ) {
            event.preventDefault();
            if ( this.parentNode.classList.contains( status ) ) {
                this.parentNode.classList.remove( status );
                slide( this.nextElementSibling, 'slideUp', this );
            }
            else {
                this.parentNode.classList.add( status );
                slide( this.nextElementSibling, 'slideDown', this );
            }
            return false;
        },
        slide = function ( target, attribute, origin ) {
            if (! shouldSpFunction() ) {
                return;
            }
            jQuery.Velocity(
                target, attribute,
                {
                    begin: function () {
                        detach( origin, 'click', ovserver )
                    },
                    complete: function () {
                        attach( origin, 'click', ovserver )
                    }
                },
                { duration: duration }
            );
        },
        attach = function ( target, event, func ) {
            target.addEventListener( event, func, false );
        },
        detach = function ( target, event, func ) {
            target.removeEventListener( event, func, false );
        };
        for ( var i = 0, l = headings.length; i < l; i++ ) {
            attach( headings[i], 'click', ovserver );
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
     * c-pagetop
     * @param  [] []
     * @return [] []
    */
    ( function () {
        if ( foot ) {
            var pagetop   = foot.querySelector( '.pagetop' )
              , percent   = 30 / 100
              , duration  = 240
              , hstatus   = 'is-hide'
              , sstatus   = 'is-show'
            var paddings  = 110
              , paddingsp = 20
              , astatus   = 'absolute';
            var
            gototopper = function ( event ) {
                event.preventDefault();
                scrollTo( body, 0, duration );
                scrollTo( html, 0, duration );
            },
            exchanges = function () {
                var scroll = ( window.pageYOffset || document.documentElement.scrollTop || 0 )
                  , height = ( window.innerHeight || document.documentElement.clientHeight || 0 );
                if ( scroll >= ( height * percent ) ) {
                    pagetop.classList.remove( hstatus );
                    pagetop.classList.add( sstatus );
                }
                else {
                    pagetop.classList.add( hstatus );
                    pagetop.classList.remove( sstatus );
                }
                return false;
            },
            justFix = function () {
                var scroll = ( window.pageYOffset || document.documentElement.scrollTop || 0 )
                  , height = foot.clientHeight
                  , bottom = shouldMbFunction() 
                             ? ( html.scrollHeight - html.clientHeight - scroll + paddingsp )
                             : ( html.scrollHeight - html.clientHeight - scroll + paddings );
                if ( bottom <= height ) {
                    pagetop.classList.add( astatus );
                }
                else {
                    pagetop.classList.remove( astatus );
                }
                return false;
            };
            pagetop.addEventListener( 'click', gototopper, false );
            window.addEventListener( 'scroll', exchanges, false );
            window.addEventListener( 'scroll', justFix, false );
        }
    } )();
    /**
     * o-more
     * @param  [] []
     * @return [] []
    */
    ( function () {
        if ( page ) {
            var more = page.querySelectorAll( '.o-more > a' );
            var date = new Date();
                date.setTime( date.getTime() + ( 30 * 60 * 1000 ) );
                href   = location.href;
                b_name = href.split( '/b/' );
                if( !( b_name[1] == undefined || b_name[1] == "" || b_name[1] == null ) ) {
                    b_code = b_name[1].split( '?' );
                    b_code = b_code[0].split( '#' );
                    b_code = b_code[0].split( '.html' );
                    if( jQuery.cookie( 'brandGender' ) == "" || jQuery.cookie( 'brandGender' ) == null ) {
                        brand_key  = 'data-set-' + b_code[0] + '-code';
                        select_all = 'select-' + b_code[0] + '-all';
                    } else {
                        var b_gen = jQuery.cookie( 'brandGender' ),
                            r_gen = jQuery( '.b-gender-region' );
                        if ( r_gen.get( 0 ) ) {
                            brand_key  = 'data-set-' + b_code[0] + '-' + b_gen + '-code';
                            select_all = 'select-' + b_code[0] + '-' + b_gen + '-all';
                        } else {
                            brand_key  = 'data-set-' + b_code[0] + '-code';
                            select_all = 'select-' + b_code[0] + '-all';
                        }
                    }

                }
            var
            getPos = function ( node ) {
                var top = window.pageYOffset || document.documentElement.scrollTop
                  , pos =node.getBoundingClientRect().top + top
                  , padding = ( shouldSpFunction() )
                      ? 60
                      : 60;
                return pos - padding;
            },
            showmore = function ( e ) {
                    e.preventDefault();
                    var wrap = this.closest( '.c-widget' )
                        , list = wrap.querySelectorAll( '.row > li' )
                        , adds = (! shouldSpFunction() )
                                ? wrap.getAttribute( 'data-l-add' )
                                : wrap.getAttribute( 'data-s-add' )
                        , orig = Array.prototype.slice.call( list )
                        , pull = Array.prototype.filter.call( list, function ( v, i ) {
                                    return ( document.defaultView.getComputedStyle( v, null ).display === 'none' );
                            } );
                    if( this.parentNode.classList.contains('remove') ) {
                                this.parentNode.classList.remove('remove');
                                var previous = this.parentNode.previousElementSibling;
                                var children = this.childNodes;
                                var lists = Array.prototype.filter.call( list, function ( v, i ) {
                                    return ( document.defaultView.getComputedStyle( v, null ).display === 'list-item' );
                                } );
                                for ( var i = 0, l = lists.length; i < l; i++ ) {
                                    var style = lists[i].getAttribute( 'style' );
                                    if( style !== null ) {
                                        lists[i].style.display = 'none';
                                    }
                                }
                                for ( var i = 0, l = children.length; i < l; i++ ) {
                                    children[i].innerHTML = '繧ゅ▲縺ｨ隕九ｋ';
                                }
                                if( previous.getAttribute('class') != 'row' && previous.getAttribute('class').match( /o-search-content/ ) ) {
                                    previous.style.display = 'none';
                                    // SelectAll縺ｨbrand縺ｮCookie繧堤┌蜉ｹ
                                    jQuery.cookie( select_all, false, { expires: date } );
                                    jQuery.cookie( brand_key, false, { expires: date } );
                                }
                                scrollTo( html, getPos( this.closest( '.c-widget' ) ), 240 );
                                scrollTo( body, getPos( this.closest( '.c-widget' ) ), 240 );
                    } else {
                            for ( var i = 0, l = pull.length; i < l; i++ ) {
                                    if ( adds ) {
                                            if ( adds > i ) {
                                                    pull[i].style.display = 'list-item';
                                            }
                                    }
                                    else {
                                            pull[i].style.display = 'list-item';
                                    }
                            }
                            if ( Array.prototype.every.call( list, function ( v, i ) {
                                    return ( document.defaultView.getComputedStyle( v, null ).display !== 'none' );
                            } ) ) {
                                    this.parentNode.classList.add('remove');
                                    var previous = this.parentNode.previousElementSibling;

                                    if( previous.getAttribute('class') != 'row' && previous.getAttribute('class').match( /o-search-content/ ) ) {
                                        previous.style.display = 'block';
                                        // SelectAll縺ｮCookie譛牙柑
                                        jQuery.cookie( brand_key, true, { expires: date } );
                                        jQuery.cookie( select_all, true, { expires: date } );
                                    }

                                    var children = this.childNodes;
                                    for ( var i = 0, l = children.length; i < l; i++ ) {
                                        children[i].innerHTML = '髢峨§繧�';
                                    }
                            } else {
                                var previous = this.parentNode.previousElementSibling;
                                if( previous.getAttribute('class') != 'row' && previous.getAttribute('class').match( /o-search-content/ ) ) {
                                    // Brand縺ｮCookie譛牙柑
                                    jQuery.cookie( brand_key, true, { expires: date } );
                                    jQuery.cookie( select_all, false, { expires: date } );
                                }
                            }
                    }
                    return false;
            };
            for ( var i = 0, l = more.length; i < l; i++ ) {
                more[i].addEventListener( 'click', showmore, false );
            }

            $( document ).one( "click", ".widget-search .o-more > a", function() {
               var $wrap = $(this).closest( '.c-widget' );
                   $adds = (! shouldSpFunction() )
                          ? $wrap.attr( 'data-l-add' )
                          : $wrap.attr( 'data-s-add' );
                   $lis    = $(this).parents( '.widget-search' ).find( '.row > li' );
                   $length = $(this).parents( '.widget-search' ).find( '.row > li' ).length;

                if ( jQuery.cookie( brand_key ) == 'true' && jQuery.cookie( select_all ) == 'true' ) {
                    $(this).parents( '.widget-search .o-more' ).addClass('remove');
                    $(this).parents( '.widget-search .o-more' ).find('span').html('髢峨§繧�');
                    $(this).parents().prev().css('display','block');
                    for ( var $i = 0; $i <= $length - 1; $i++ ) {
                        if( $lis.eq($i).css('display') == 'none' ) {
                            $lis.eq($i).css('display','list-item');
                        }
                    }
                } else if ( jQuery.cookie( brand_key ) == 'true' && ( jQuery.cookie( select_all ) == 'false' || jQuery.cookie( select_all ) == null ) ) {
                    $cn = 1;
                    for ( var $i = 0; $i <= $length - 1; $i++ ) {
                        if( $lis.eq($i).css('display') == 'none' ) {
                            if( $adds ) {
                                if( $adds >= $cn ) {
                                    $lis.eq($i).css('display','list-item');
                                } else {
                                    $lis.eq($i).css('display','none');
                                }
                            } else {
                                $lis.eq($i).css('display','list-item');
                            }
                            $cn++;
                        }
                    }
                }
            } );

            $(window).load(function() {
                $( '.widget-search .o-more > a' ).click();
            } );
        }
    } )();
    /**
     * o-lazy
     * @param  [] []
     * @return [] []
    */
    ( function () {
        var duration  = 480
          , animation = 'swing'
          , selectors = document.querySelectorAll(
                [
                  'img[data-src]',
                  'img[data-srcset]',
                  'source[data-src]',
                  'source[data-srcset]'
                ].join( ', ' )
            );
        var
        observe = function () {
            selectors = document.querySelectorAll(
                [
                  'img[data-src]',
                  'img[data-srcset]',
                  'source[data-src]',
                  'source[data-srcset]'
                ].join( ', ' )
            );
        },
        collect = function ( target ) {
            return {
                osrc: target.getAttribute( 'src' ),
                fsrc: target.getAttribute( 'data-src' ),
                oset: target.getAttribute( 'srcset' ),
                fset: target.getAttribute( 'data-srcset' ),
            };
        },
        lonload = function () {
            for ( var i = 0, l = selectors.length; i < l; i++ ) {
                var target = selectors[i]
                  , attribute = collect( target );
                if ( ( attribute['fsrc'] ) && ( attribute['osrc'] !== attribute['fsrc'] ) ) {
                    target.setAttribute( 'src', attribute['fsrc'] );
                }
                if ( ( attribute['fset'] ) && ( attribute['oset'] !== attribute['fset'] ) ) {
                    target.setAttribute( 'srcset', attribute['fset'] );
                }
            }
        },
        lonscroll = function () {
            for ( var i = 0, l = selectors.length; i < l; i++ ) {
                var target = selectors[i]
                  , attribute = collect( target )
                  , pos = target.getBoundingClientRect().top - ( window.innerHeight || document.documentElement.clientHeight );
                if ( ( window.pageYOffset || document.documentElement.scrollTop ) > pos ) {
                    if ( ( attribute['fsrc'] ) && ( attribute['osrc'] !== attribute['fsrc'] ) ) {
                        target.setAttribute( 'src', attribute['fsrc'] );
                    }
                    if ( ( attribute['fset'] ) && ( attribute['oset'] !== attribute['fset'] ) ) {
                        target.setAttribute( 'srcset', attribute['fset'] );
                    }
                }
            }
        };
        if ( shouldSpFunction() ) {
            window.addEventListener( 'load', lonload, false );
        }
        else {
            window.addEventListener( 'load', lonscroll, false );
            window.addEventListener( 'scroll', lonscroll, false );
        }
        document.addEventListener( 'DOMNodeInserted', observe, false );
    } )();
    /**
     * c-navi
     * @param  [] []
     * @return [] []
    */
    ( function () {
        var $list = $( '.facet .o-fold.list li.active' )
          ,  $title = $list.find( '.o-l-1-h' )
          ,  $btn  = $( '.facet .o-fold.list .o-l-1-h a' );
        if ( $list ) {
            $list.find( '.o-l-1-c' ).css( { 'display':'block' } );
            $title.addClass( 'is-selected' );
        }
        $btn.on( 'click', function( e ) {
          var $this = $( this )
            , $p_title = $this.closest( 'h4' )
            , $p_list = $this.closest( '.o-l-1' );
          e.preventDefault();
            if ( $p_list.hasClass( 'active' ) ) {
                $p_list.removeClass( 'active' );
                $p_list.find( '.o-l-1-c' ).slideUp();
            } else{
                $p_list.addClass( 'active' );
                $p_list.find( '.o-l-1-c' ).slideDown();
            }
        } );
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
    /**
     * u-data-href
     * @param  [ lib ] [ jQuery ]
     * @return [ lib ] [ SlickSlider ]
    */
    ( function () {
        if ( head ) {
            var anchors = document.querySelectorAll( '[data-href]' )
              , lower   = head.querySelector( '.c-header-lower' );
            var
            getPos = function ( node ) {
                var top = window.pageYOffset || document.documentElement.scrollTop
                  , ids = node.getAttribute( 'data-href' )
                  , pos = ids.indexOf( '#' ) === 0
                      ? document.getElementById( ids.substr( 1 ) ).getBoundingClientRect().top + top
                      : document.getElementById( ids ).getBoundingClientRect().top + top
                  , padding = ( shouldSpFunction() )
                      ? 80
                      : 100;
                return pos - padding;
            },
            shouldScroll = function ( event ) {
                event.preventDefault();
                scrollTo( html, getPos( this ), 240 );
                scrollTo( body, getPos( this ), 240 );
            };
            for ( var i = 0, l = anchors.length; i < l; i++ ) {
                anchors[i].addEventListener( 'click', shouldScroll, false );
            }
        }
    } )();
    /**
     * c-thumnail
     * @param  [ lib ] [ jQuery ]
     * @return [ lib ] [ remodal ]
    */
    ( function () {
        var cardpro = jQuery( '.widget-search .card-product' ),
            licrdpr = 'card-product-i';
        var 
        ProductCard = function ( wrapper ) {
            var $target = wrapper.find( '.' + licrdpr ),
                $length = $target.length;
            if ( $length >= 2 ) {
                $target.each( function( i ) {
                    if( i !== 0 ) $target.eq( i ).detach();
                } );
            } else {
                wrapper.append( $target.clone() );
            }
        }

        cardpro.on( {
          'mouseenter' : function () {
             var $this   = jQuery( this ),
                 $licrdpr = $this.find( '.' + licrdpr );

             if ( ! shouldMbFunction() && $licrdpr.get( 0 ) ) {
                 ProductCard( $this );
             }
          },
          'mouseleave' : function () {
             var $this = jQuery( this ),
                 $licrdpr = $this.find( '.' + licrdpr );

             if ( ! shouldMbFunction() && $licrdpr.get( 0 ) ) {
                ProductCard( $this );
             }
          }
        } );
    } )();

} )();