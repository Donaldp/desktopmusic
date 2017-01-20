/* App Code */

    var lbartists = [];
    var lbalbums  = [];
    var allSongs  = [];
    var playing;
    var musicState;
    
    var timer = setInterval(function() {getPos()}, 100);
    
    function desktopmusic_Load() {
        document.title             = 'Desktop Music';
        document.body.style.color  = 'black';
        document.body.style.margin = '0px';
        formRequest.bottomright();
        formRequest.trayApp(document.title);
        sDirectory.getFiles(specialdirectory.mymusic, '*.mp3', true);
        application.ready('show');
    }    
    
    function getFiles_onRetrieve(url) {
        sDirectory.getFileName(url);
        id3v2.url(url);
        var mp3s    = document.getElementById('songs');
        
        var data = '"loadSong(' + '\'' + url + '\'' + ')"';
        var song = sDirectory.returnName;
        var artist;
        
        if (id3v2.title==null){
            song     = song.replace('.mp3', '');
        }
        else {
            song = id3v2.title;
        }
        
        if (id3v2.artist==null){
            artist = 'Unknown Artist';
        }
        else {
            artist = id3v2.artist;
        }
        
        var mp3s = document.getElementById('songs');
        song     = song.substring(0, 40-3) + '...';
        artist   = artist.substring(0, 18);
        mp3s.insertAdjacentHTML('beforeend', 
        '<li onClick=' + data + '>' + song  + '</li>');
        allSongs.push(url);
    }
    
    function autoplaynextSong() {
        if (musicState=='wmppsTransitioning') { }
        else if(musicState=='wmppsReady') { }
        else if(musicState=='wmppsPlaying') { }
        else {
            try {
                var currentSong = allSongs.indexOf(playing)
                var i = currentSong;
                i     = i + 1;
                i     = i % allSongs.length;
                loadSong(allSongs[i])
            }
            catch (err) {}
        }
    }
    
    function nextSong() {
        try {
            var currentSong = allSongs.indexOf(playing)
            var i = currentSong;
            i     = i + 1;
            i     = i % allSongs.length;
            loadSong(allSongs[i])
        }
        catch (err) {}
    }
    
    function prevSong() {
        try {
            var currentSong = allSongs.indexOf(playing)
            var i = currentSong;
            i     = i - 1;
            i     = i % allSongs.length;
            loadSong(allSongs[i])
        }
        catch (err) {}
    }
    
    function playSong() {
        audio.play();
    }
    
    function pauseSong() {
        audio.pause();
        
    }
    
    function loadSong(song) {
        audio.path(song.toString());
        playing = song.toString();
        id3v2.url(song.toString());
        sDirectory.getFileName(song.toString());
        id3v2.retrieveCover();
        var song = sDirectory.returnName;
        
        if (id3v2.title==null){
            song     = song.replace('.mp3', '');
        }
        else {
            song = id3v2.title;
        }
        
        if (id3v2.artist==null){
            artist = 'Unknown Artist';
        }
        else {
            artist = id3v2.artist;
        }
        
        var path = id3v2.coverPath;
        
        if (path==null) {
            path = 'music2.png';
        }
        else {
            path = path.replace(/\\/g, '/');
        }
        document.getElementById('bgCover').style.backgroundImage = 'url("' + path + '")';
        document.getElementById('CoverArt').style.backgroundImage = 'url("' + path + '")';
        document.getElementById('title').innerHTML = artist + ' - ' + song;
        document.title = song;
        formRequest.trayAppTitle('Desktop Music\n' + song);
    }    
    
    function seek() {
        var tim = audio.currentPosition;
        var dur = audio.duration;
        
        
        dur = dur.replace(":", "");
        if (dur.startsWith('0')) {
            dur.substring(1);
        }
        
        tim = tim.replace(":", "");
        if (tim.startsWith('0')) {
            tim.substring(1);
        }
        
        var Duration = 100 / Number(dur);
        Duration     = Duration * Number(dur);
        
        var Duration2 = Duration / dur;
        Duration2     = Duration2 * dur;
        Duration2     = dur / Duration2;
        
        var Current = Duration / dur;
        Current     = Current * tim;
        Current     = tim / Duration;
        
        document.getElementById('seek').setAttribute('min', 0);
        document.getElementById('seek').setAttribute('value', 0);
        document.getElementById('seek').setAttribute('max', Duration2);
        document.getElementById('seek').setAttribute('step', '0.01');
        document.getElementById('seek').setAttribute('value', Current);
    }
    
    function getPos() {
        try {
            seek();
        }
        catch (err) { }
    }
    
    function media_playerState(state) {
        
        musicState = state;
        
        if (state=='wmppsPlaying') {
            document.getElementById('btnPlay').setAttribute('onClick', 'pauseSong();');
            document.getElementById('btnPlay').style.backgroundImage = 'url("controls/pause.png")';
        }
        else if(state=='wmppsPaused')
        {
            document.getElementById('btnPlay').setAttribute('onClick', 'playSong();');
            document.getElementById('btnPlay').style.backgroundImage = 'url("controls/play.png")';
        }
        else if(state=='wmppsStopped') 
        {
            formRequest.trayAppTitle('Desktop Music')
            document.getElementById('btnPlay').setAttribute('onClick', 'playSong();');
            document.getElementById('btnPlay').style.backgroundImage = 'url("controls/play.png")';
            document.getElementById('title').innerHTML = '';
            try {
                autoplaynextSong();
            }
            catch (err) {  }
        }
        
    }    
    
    function trayIcon_Click() {
        if (thiswindow.isVisible == true) {
            thiswindow.visible(false);
        }
        else {
            thiswindow.visible(true);
        }
    }
    
    function application_onReady() {
        formRequest.preventDrag(true);
        application.onExit('kill');
        //Auto Play
        nextSong();
    }
    
