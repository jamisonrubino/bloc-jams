//
// ============================= SET CURRENTLYPLAYINGSONGNUMBER, CURRENTSONGFROMALBUM, CURRENTSOUNDFILE, VOLUME, IF ALREADY PLAYING: STOP
// 
var setSong = function (songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber-1];
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
    });
    
    setVolume(currentVolume);
    
    updateSeekBarWhileSongPlays();
};

//
// ============================== SEEK PLAYING TRACK TO SPECIFIED TIME
//
 var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 }

//
// ============================== SET VOLUME
//
var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
 };


//
// ============================= GET CELL # FOR SONG
// 
var getSongNumberCell = function (number) {
    return $(".album-view-song-item .song-item-number").eq(number-1);
};


//
// ============================= GENERATE ALBUM SONG LIST FROM OBJECT DATA
//
var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'     + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
      + '</tr>';
 
     var $row = $(template);

	//
	// ============================= SET CLICK EVENTS FOR SONG ITEMS (CHANGE CURRENTLYPLAYING, TOGGLE PLAY/PAUSE ICONS)
	//
	var clickHandler = function() {
		if (currentlyPlayingSongNumber !== null) {
			var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
			currentlyPlayingCell.html(currentlyPlayingSongNumber);
            setVolume(currentVolume);
		} else {
            updateSeekPercentage($('.volume .seek-bar'), currentVolume/100);
        }
        
		if (currentlyPlayingSongNumber !== songNumber) {
			$(this).html(pauseButtonTemplate);
			setSong(songNumber);
            currentSoundFile.play();
            updatePlayerBarSong();
            setVolume(currentVolume);
            
		} else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                setVolume(currentVolume);
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
                setVolume(currentVolume);
            }
		}
	};
	

	//
	// ============================= SET MOUSEOVER AND MOUSELEAVE EVENTS FOR SONG ITEMS
	// 
    var onHover = function(event) {
        var songNumberCell = getSongNumberCell(songNumber);
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = getSongNumberCell(songNumber);
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
	 };

	
	//
	// ============================= FUNCTION CALLS
	//
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
	 
 };

	
//
// ============================= SET PLAYER BAR SONG INFORMATION
//
var updatePlayerBarSong = function() {
	$('.currently-playing .song-name').text(currentSongFromAlbum.title);
	$('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
	
	$('.main-controls .play-pause').html(playerBarPauseButton);
    
    var setTotalTimeInPlayerBar = function (totalTime) {
        $(".total-time").text(filterTimeCode(totalTime));
    };
    setTotalTimeInPlayerBar(currentAlbum.songs[currentlyPlayingSongNumber-1].duration);
};


//
//	============================= SET CURRENT ALBUM
//
var setCurrentAlbum = function(album) {
	currentAlbum = album;
   // #1
   var $albumTitle = $('.album-view-title');
   var $albumArtist = $('.album-view-artist');
   var $albumReleaseInfo = $('.album-view-release-info');
   var $albumImage = $('.album-cover-art');
   var $albumSongList = $('.album-view-song-list');
 
   // #2
   $albumTitle.text(album.title);
   $albumArtist.text(album.artist);
   $albumReleaseInfo.text(album.year + ' ' + album.label);
   $albumImage.attr('src', album.albumArtUrl);
 
   // #3
   $albumSongList.empty();
	 
   // #4
   for (var i = 0; i < album.songs.length; i++) {
       var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
       $albumSongList.append($newRow);
   }
};


//
// ============================== SET UP SEEK BARS
//
 var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');
     $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;
         
        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);   
        }
         
        updateSeekPercentage($(this), seekBarFillRatio);
         
     });
     $seekBars.find('.thumb').mousedown(function(event) {
         var $seekBar = $(this).parent();
         $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
             
            if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
            } else {
                setVolume(seekBarFillRatio);
            }
             
            updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
 };


//
// ============================== UPDATE SEEK BAR WHILE SONG PLAYS
//
 var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         currentSoundFile.bind('timeupdate', function(event) {
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
             setCurrentTimeInPlayerBar(this.getTime());
         });
     }
    //
    // ============================== SET CURRENT TIME IN PLAYER BAR
    //
    var setCurrentTimeInPlayerBar = function (currentTime) {
        $(".current-time").text(filterTimeCode(currentTime));
    };
 };

var filterTimeCode = function (timeInSeconds) {
    var time = Math.floor(parseFloat(timeInSeconds));
    var timeText;
    if (time > 59) {
        timeText = Math.floor(time/60) + ":";
        if (time%60 === 0) {
            timeText += "00";
        } else if (time%60 < 10) {
            timeText += "0" + time%60;
        } else {
            timeText += time%60;
        }
    } else if (time < 10) {
        timeText = "0:0" + time;
    } else if (time >= 10) {
        timeText = "0:" + time;
    }
    return timeText;
}

//
// ============================== UPDATE SEEK BAR %
//
 var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent); // offsetXPercent stays above 0       \
    offsetXPercent = Math.min(100, offsetXPercent); // offsetXPercent stays below 100   /   counterintuitive, but apparently how it works
 
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };





//
// ============================= RETURN INDEX # OF SONG FROM ALBUM
//
var trackIndex = function(album, song) {
	return album.songs.indexOf(song);
};


//
// ============================= SET CURRENT SONG TO NEXT, UPDATE PLAYER BAR
//
var nextSong = function() {
	var getLastSongNumber = function(index) {
   	    return index == 0 ? currentAlbum.songs.length : index;
    };
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    if (currentSongIndex >= currentAlbum.songs.length) {
   	    currentSongIndex = 0;
    }
    setSong(currentSongIndex+1);
    currentSoundFile.play();
    updatePlayerBarSong();

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};


//
// ============================= SET CURRENT SONG TO PREVIOUS, UPDATE PLAYER BAR
//
var previousSong = function() {
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    setSong(currentSongIndex+1);
    currentSoundFile.play();
    updatePlayerBarSong();
    
    $('.main-controls .play-pause').html(playerBarPauseButton);
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};


var togglePlayFromPlayerBar = function () {
    if (currentSoundFile) {
        if (currentSoundFile.isPaused()) {
            currentSoundFile.play();
            getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
        } else {
            currentSoundFile.pause();
            getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
        }
    }
}

//
// ============================= VARIABLE DEFINITIONS
//
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playerBarPlayPause = $(".main-controls .play-pause");

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

//
// ============================= WINDOW ONLOAD
//
$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
	var albums = [albumPicasso, albumMarconi, albumSpring];
	var albumArt = document.getElementsByClassName('album-cover-art')[0];
	var index = 1;
    
	$playerBarPlayPause.click(togglePlayFromPlayerBar);
    
//
// ============================= CYCLE ALBUMS ON ALBUM ART CLICK
//
	albumArt.addEventListener("click", function(event) {
        setCurrentAlbum(albums[index]);
		index++;
		if (index >= albums.length) {
			index = 0;
		}
	});
 });