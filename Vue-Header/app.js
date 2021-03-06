// logo link directive
Vue.directive('logo', {
    bind(el, binding, vnode) {
        el.querySelector('a').href = binding.value + 'index2.html';
        el.querySelector('img').src = binding.value + 'Vue-Header/header/header-logo.svg'
    }
});
//menu directive with
Vue.directive('menu', {
    bind(el, binding) {
        const image = el.querySelector('img');
        if (binding.arg === 'dark') {
            image.src = binding.value + 'Vue-Header/header/header-menu.svg';
        } else if (binding.arg === 'light') {
            image.src = binding.value + 'Vue-Header/header/header-menu-white.svg';
        }
        image.alt = 'menu'
    }
});


//logo component
Vue.component('appLogo', {
    template: `
    <div class="col-4 header-logo align-items-center">
        <a class="d-flex align-items-center" >
            <img  alt="Logo" />
        </a>
    </div>
    `
});
//menu component
Vue.component('appMenu', {
    template: `
    <div class="header-menu col-4 d-flex justify-content-center align-items-center">
        <img/>
    </div>
    `
});
// sound and lang
Vue.component('soundLang', {
    data() {
        return {
            color: '#fff',
            circleColor: '#7fd1d8',
            lang: 'Eng'
        }
    },
    methods: {
        soundLand() {
            if (this.lang === 'ქარ') {
                this.lang = 'Eng'
            } else {
                this.lang = 'ქარ'
            }
        },
        colorSwitch() {
            const onCircle = document.getElementById('Ellipse_380-2');
            const onIcon = document.getElementById('Path_1226');
            if (onCircle.getAttribute("fill") === this.color) {
                //change icon gb and path color for sound on
                onCircle.setAttribute("fill", this.circleColor);
                onIcon.setAttribute("fill", this.color);
                //change icon gb and path color for sound on
                // lang.style.background = '#fff'
            } else {
                onCircle.setAttribute("fill", this.color);
                onIcon.setAttribute("fill", this.circleColor);
            }
        }
    },
    template: `
  

    <div class="header-sound col-4 d-flex justify-content-end align-items-center">
        <button class="header-sound_switch sound-on" @click="colorSwitch">
            <svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#"
                xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" id="Layer_1"
                data-name="Layer 1" viewBox="0 0 36 36" version="1.1" sodipodi:docname="sound01.svg"
                inkscape:version="0.92.3 (2405546, 2018-03-11)">
                <metadata id="metadata3825">
                    <rdf:RDF>
                        <cc:Work rdf:about="">
                            <dc:format>image/svg+xml</dc:format>
                            <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                            <dc:title>sound01</dc:title>
                        </cc:Work>
                    </rdf:RDF>
                </metadata>
                <sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1"
                    objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0"
                    inkscape:pageshadow="2" inkscape:window-width="1366" inkscape:window-height="713"
                    id="namedview3823" showgrid="false" inkscape:zoom="14.416667" inkscape:cx="18"
                    inkscape:cy="18" inkscape:window-x="0" inkscape:window-y="0"
                    inkscape:window-maximized="1" inkscape:current-layer="Component_4_220" />
                <g id="Component_4_220" data-name="Component 4 220">
                    <circle id="Ellipse_380-2" data-name="Ellipse 380-2" :fill="color" cx="18" cy="18"
                        r="18" />
                    <g id="Group_1572" data-name="Group 1572">
                        <path id="Path_1226" :fill="circleColor" transform="translate(-6 -6)"
                            d="m 28.22,23.37 a 5.18,5.18 0 0 1 -1.1,3.07 c -0.13,0.18 -0.32,0.31 -0.55,0.13 a 0.38,0.38 0 0 1 -0.12,-0.52 l 0.06,-0.07 A 5.36,5.36 0 0 0 27.4,24 3.13,3.13 0 0 0 26.62,21.17 c -0.14,-0.16 -0.31,-0.33 -0.18,-0.57 0.13,-0.24 0.45,-0.28 0.69,0 a 4,4 0 0 1 1.09,2.77 z m 2.15,-0.05 a 10.88,10.88 0 0 1 -1.07,4.48 0.4,0.4 0 0 1 -0.5,0.26 h -0.06 c -0.22,-0.08 -0.26,-0.3 -0.13,-0.57 a 9.6,9.6 0 0 0 1,-4.43 6.71,6.71 0 0 0 -1,-3.4 0.39,0.39 0 0 1 0.6,-0.49 v 0.07 a 7.2,7.2 0 0 1 1,2.87 c 0.11,0.39 0.13,0.8 0.16,1.21 z M 33,23.35 a 11.2,11.2 0 0 1 -1.45,5.26 c -0.13,0.26 -0.29,0.5 -0.43,0.75 a 0.37,0.37 0 0 1 -0.49,0.22 h -0.08 c -0.22,-0.14 -0.19,-0.36 -0.07,-0.57 0.28,-0.54 0.6,-1.07 0.85,-1.62 A 9.22,9.22 0 0 0 32.14,22 9,9 0 0 0 30.58,18.26 L 30.47,18.1 a 0.38,0.38 0 0 1 0.05,-0.53 0.37,0.37 0 0 1 0.53,0.05 v 0.05 a 9.48,9.48 0 0 1 1.54,3.1 9.05,9.05 0 0 1 0.41,2.58 z m -9.37,0.18 v 5.41 A 1.06,1.06 0 0 1 23,30 1,1 0 0 1 21.87,29.8 l -3.81,-3.05 a 0.72,0.72 0 0 0 -0.38,-0.13 c -0.55,0 -1.1,0 -1.65,0 A 1,1 0 0 1 15,25.64 v -0.08 q 0,-2.07 0,-4.14 a 1,1 0 0 1 1,-1 h 0.08 c 0.55,0 1.1,0 1.65,0 a 0.85,0.85 0 0 0 0.46,-0.16 c 1.29,-1 2.56,-2 3.84,-3 a 0.94,0.94 0 0 1 1.06,-0.09 1,1 0 0 1 0.57,0.91 z m -0.76,0 c 0,-1.77 0,-3.54 0,-5.31 0,-0.15 0.05,-0.36 -0.14,-0.45 -0.19,-0.09 -0.33,0.07 -0.45,0.16 l -3.86,3 a 1,1 0 0 1 -0.47,0.15 c -0.6,0 -1.21,0 -1.81,0 -0.26,0 -0.38,0.11 -0.38,0.36 v 3.95 c 0,0.27 0.13,0.39 0.4,0.38 0.43,0 0.87,0 1.3,0 a 1.76,1.76 0 0 1 1.34,0.48 c 1.19,1 2.4,1.94 3.61,2.9 a 0.34,0.34 0 0 0 0.31,0.07 c 0.08,0 0.12,-0.18 0.15,-0.28 a 0.94,0.94 0 0 0 0,-0.29 z" />
                    </g>
                </g>
            </svg>
        </button>
        <button class="header-sound_switch lang" @click="soundLand">
            {{ lang }}
        </button>
    </div>
    `
});



var app = new Vue({
    el: '#app',

});
