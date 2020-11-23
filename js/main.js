$(document).ready(function () {

    let lang = document.querySelector('.lang');
    // langSelect = langParent.querySelector('.lang__list');
    lang.addEventListener('click', function () {
        // langSelect.classList.toggle('active');
        this.querySelector('.lang__list').classList.toggle('active');
    });
    let langSelect = lang.querySelectorAll('a');
    let langDefault = lang.querySelector('.lang__default span');

    langSelect.forEach(element => {
        element.addEventListener('click', function () {
            langDefault.innerText = this.innerText;
        })
    });
    // let body = document.body;
    // body.addEventListener('click', function() {
    //     this.querySelector('.lang__list').remove('active');
    // })

    // Mobile menu
    $('.close').on('click', function () {
        $('.menu-mobile').slideUp(500),
            $('.hamburger-menu').show(500)
    })
    $('.hamburger-menu').on('click', function () {
        $('.menu-mobile').slideDown(500),
            $('.hamburger-menu').hide()
    })
    // Language selector 
    $('.lang__select-mobile').on('click', function () {
        $('.lang__list-mobile').fadeToggle(500);
    })

    let langSelected = $('.lang__select-mobile a');
    $('.lang__list-mobile div p').on('click', function () {
        // console.log($(this).html());
        langSelected.html($(this).html())
    })
    // Slider
    $('.main-carousel').flickity({
        // options
        cellAlign: 'left',
        contain: true,
        wrapAround: true,
        friction: 0.6,
        draggable: false,
        on: {
            change: function (index) {
                console.log(index)
                $('.pagenumber b').html((index + 1).toString().padStart(2, 0));
            }
        }

    });
    let dot = $('.main-carousel .flickity-page-dots');
    $('.tool .number').append(dot);
    $('.next-prev .next').on('click', function () {
        $('.main-carousel').flickity('next');
    })
    $('.next-prev .prev').on('click', function () {
        $('.main-carousel').flickity('previous');
    })

    // Video pop-up
    $('.video__outline').on('click', function () {
        let id = $(this).data('id');
        console.log(id);
        $('.video__popup').css('visibility', 'visible');
        $('.video__popup iframe').attr('src', 'https://www.youtube.com/embed/' + id).css('visibility', 'visible');
        $('.video__popup p').css('visibility', 'visible');
        $('.video__popup p').on('click', function () {
            $('.video__popup').css('visibility', 'hidden');
            $('.video__popup iframe').css('visibility', 'hidden')
            $(this).css('visibility', 'hidden');
            $('.video__popup iframe').attr('src', 'https://www.youtube.com/embed/')
        });
    });

    // Photoswipe
    var initPhotoSwipeFromDOM = function (gallerySelector) {
        var parseThumbnailElements = function (el) {
            var thumbElements = el.childNodes,
                numNodes = thumbElements.length,
                items = [],
                figureEl,
                linkEl,
                size,
                item;
            for (var i = 0; i < numNodes; i++) {
                figureEl = thumbElements[i]; // <figure> element
                if (figureEl.nodeType !== 1) {
                    continue;
                }
                linkEl = figureEl.children[0]; // <a> element
                size = linkEl.getAttribute('data-size').split('x');
                item = {
                    src: linkEl.getAttribute('href'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };
                if (figureEl.children.length > 1) {
                    item.title = figureEl.children[1].innerHTML;
                }
                if (linkEl.children.length > 0) {
                    // <img> thumbnail element, retrieving thumbnail url
                    item.msrc = linkEl.children[0].getAttribute('src');
                }
                item.el = figureEl; // save link to element for getThumbBoundsFn
                items.push(item);
            }
            return items;
        };
        var closest = function closest(el, fn) {
            return el && (fn(el) ? el : closest(el.parentNode, fn));
        };
        var onThumbnailsClick = function (e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
            var eTarget = e.target || e.srcElement;
            var clickedListItem = closest(eTarget, function (el) {
                return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
            });
            if (!clickedListItem) {
                return;
            }
            var clickedGallery = clickedListItem.parentNode,
                childNodes = clickedListItem.parentNode.childNodes,
                numChildNodes = childNodes.length,
                nodeIndex = 0,
                index;
            for (var i = 0; i < numChildNodes; i++) {
                if (childNodes[i].nodeType !== 1) {
                    continue;
                }
                if (childNodes[i] === clickedListItem) {
                    index = nodeIndex;
                    break;
                }
                nodeIndex++;
            }
            if (index >= 0) {
                openPhotoSwipe(index, clickedGallery);
            }
            return false;
        };
        var photoswipeParseHash = function () {
            var hash = window.location.hash.substring(1),
                params = {};
            if (hash.length < 5) {
                return params;
            }
            var vars = hash.split('&');
            for (var i = 0; i < vars.length; i++) {
                if (!vars[i]) {
                    continue;
                }
                var pair = vars[i].split('=');
                if (pair.length < 2) {
                    continue;
                }
                params[pair[0]] = pair[1];
            }
            if (params.gid) {
                params.gid = parseInt(params.gid, 10);
            }
            return params;
        };
        var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
            var pswpElement = document.querySelectorAll('.pswp')[0],
                gallery,
                options,
                items;
            items = parseThumbnailElements(galleryElement);
            options = {
                galleryUID: galleryElement.getAttribute('data-pswp-uid'),
                getThumbBoundsFn: function (index) {
                    var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                        rect = thumbnail.getBoundingClientRect();

                    return {
                        x: rect.left,
                        y: rect.top + pageYScroll,
                        w: rect.width
                    };
                },
                showAnimationDuration: 0,
                hideAnimationDuration: 0
            };
            if (fromURL) {
                if (options.galleryPIDs) {
                    for (var j = 0; j < items.length; j++) {
                        if (items[j].pid == index) {
                            options.index = j;
                            break;
                        }
                    }
                } else {
                    options.index = parseInt(index, 10) - 1;
                }
            } else {
                options.index = parseInt(index, 10);
            }
            if (isNaN(options.index)) {
                return;
            }
            if (disableAnimation) {
                options.showAnimationDuration = 0;
            }
            gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        };
        var galleryElements = document.querySelectorAll(gallerySelector);
        for (var i = 0, l = galleryElements.length; i < l; i++) {
            galleryElements[i].setAttribute('data-pswp-uid', i + 1);
            galleryElements[i].onclick = onThumbnailsClick;
        }
        var hashData = photoswipeParseHash();
        if (hashData.pid && hashData.gid) {
            openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
        }
    };

    $(window).load(function () {
        initPhotoSwipeFromDOM('.carousel-img');
    });

    // Back to top
    $('.back2top').on('click', function () {
        $("html, body").animate({
            scrollTop: 0
        }, 1500);
        
    })
})