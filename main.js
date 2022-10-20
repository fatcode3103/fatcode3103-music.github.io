const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd');
const heading = $('.header-sub h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const volumBtn = $('.volum-bar')
const playList = $('.playlist')

const app = {
    currentIndex: 0,
    checkPlay: false,
    isRandom: false,
    isRepeat: false,
    songs : [
        {
            name: 'Bao tiền một mớ bình yên',
            singer: '14 Casper',
            path: "./assets/musicsub/'bao tiền một mớ bình yên' - 14 Casper & Bon (Official).mp4",
            image: './assets/img/14Casper2.jpg'
        },
        {
            name: 'Chỉ là muốn nói',
            singer: 'Chang',
            path: './assets/musicsub/Chỉ Là Muốn Nói (300) - Khải.mp4',
            image: './assets/img/chilamuonnoi.jpg'
        },
        {
            name: 'Mãi mãi không phải anh',
            singer: 'Thanh Bình',
            path: './assets/musicsub/Mãi Mãi Không Phải Anh - Thanh Bình - Official Audio.mp4',
            image: './assets/img/maimaikhongphaianh.jpg'
        },
        {
            name: 'Tự sự',
            singer: 'Orange',
            path: './assets/musicsub/Orange - Tự Sự ft. Thuận Nguyễn l Qua Bển Làm Chi OST - Phim đang chiếu tại rạp.mp4',
            image: './assets/img/tusu.jpg'
        },
        {
            name: 'Chờ đợi có đáng sợ',
            singer: 'Andiez',
            path: './assets/musicsub/CHỜ ĐỢI CÓ ĐÁNG SỢ - ANDIEZ - OFFICIAL MV.mp4',
            image: './assets/img/chodoi.jpg'
        },
        {
            name: 'Mãi mãi không phải anh',
            singer: 'Thanh Bình',
            path: './assets/musicsub/Mãi Mãi Không Phải Anh - Thanh Bình - Official Audio.mp4',
            image: './assets/img/maimaikhongphaianh.jpg'
        },
        {
            name: 'Chỉ là muốn nói',
            singer: 'Chang',
            path: './assets/musicsub/Chỉ Là Muốn Nói (300) - Khải.mp4',
            image: './assets/img/chilamuonnoi.jpg'
        },
    ],

    render: function(){
        const htmls = this.songs.map((song, index)=>{
            return `
            <div class="song" data-index='${index}'>
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
            </div>
            <div class="option">
            <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('');
    },
    
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    
    handleEvent: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;
        //xu ly cd
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
        }
        // CD quay
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000, // thoi gian quay het 1 vong
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        //click play
        playBtn.onclick = function(){
            if(_this.checkPlay){
                audio.pause();
            }else{
                audio.play();
            }
        }
        //lang nghe onplay/onpause
        audio.onplay = function(){
            _this.checkPlay = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        audio.onpause = function(){
            _this.checkPlay = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //thoi gian chay
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = audio.currentTime/audio.duration*100
                progress.value = progressPercent
            }
        }

        //tua
        progress.onchange = function(e){
            if(audio.duration){
                const newSec = e.target.value / 100 * audio.duration //e.target => truy cap vao phan tu phat ra su kien
                audio.currentTime = newSec
            }
        }
        //volum
        volumBtn.onchange = function(e){
            const newVolum = e.target.value / 100
            audio.volume = newVolum
        }
        //next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong();
            }else{
                _this.nextSong();
            }
            audio.play();
        }
        //prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong();
            }else{
                _this.prevSong();
            }
            audio.play();
        }
        //random bat/tat
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        //repeat bat tat
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // next song khi het bai
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }
        document.onkeyup = function(e) {
            if(e.which === 32){
                playBtn.click();
            }
        }
        //lang gnhe hanh vi click vao playlist
        playList.onclick = function(e){
            const songNode = e.target.closest('.song')
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    _this.currentIndex = songNode.getAttribute('data-index');
                    _this.loadCurrentSong();
                    audio.play();
                }
            }
        }
    },

    // next song
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex>this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    // prev song
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length;
        }
        this.loadCurrentSong();
    },

    //random song
    randomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    
    loadCurrentSong: function(){
        heading.innerHTML = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path;
    },
    
    start: function(){
        // Dinh nghia cac thuoc tinh cho obj
        this.defineProperties();
        // lang nghe/xu ly su kien
        this.handleEvent();
        // tai bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong();
        // Render palylist
        this.render();
    }
}
app.start();