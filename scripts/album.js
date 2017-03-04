 var albumPicasso = {
     title: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { title: 'Blue', duration: '4:26' },
         { title: 'Green', duration: '3:14' },
         { title: 'Red', duration: '5:01' },
         { title: 'Pink', duration: '3:21'},
         { title: 'Magenta', duration: '2:15'}
     ],
	 num: 1
 };
 
 // Another Example Album
 var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ],
	 num: 2
 };

 var albumSpring = {
     title: 'Spring',
     artist: 'Time',
     label: 'Four Seasons',
     year: '2017',
     albumArtUrl: 'assets/images/album_covers/14.png',
     songs: [
         { title: 'In', duration: '12:00' },
         { title: 'Out', duration: '6:00' },
         { title: 'Up', duration: '1:23'},
         { title: 'Down', duration: '3:21' },
         { title: 'Left/Right', duration: '9:15'}
     ],
	 num: 3
 };

 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     return $(template);
};

//
//	============================= SET CURRENT ALBUM
//
 var setCurrentAlbum = function(album) {
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
//	============================= FIND PARENT BY CLASS NAME
//
var findParentByClassName = function(element, targetClass) {
    if (element) {
		  if (element.parentElement) {
			  var currentParent = element.parentElement;
			  while (currentParent.className != targetClass && currentParent.className !== null) {
					currentParent = currentParent.parentElement;
			  }
		  } else {
			  console.log("No parent found.");
		  }
		  if (element.parentElement.className !== targetClass && currentParent.className !== targetClass) {
			  console.log("No parent found with that class name.");
		  }
        return currentParent;
    }
};

//
// ============================= GET SONG ITEM
//
var getSongItem = function(element) {
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }  
};

//
// ============================= CLICK HANDLER FOR PLAY/PAUSE BUTTON
//
var clickHandler = function(targetElement) {
	var songItem = getSongItem(targetElement); 
	// IF NO SONG PLAYING
   if (currentlyPlayingSong === null) {
       songItem.innerHTML = pauseButtonTemplate;
       currentlyPlayingSong = songItem.getAttribute('data-song-number');
	// IF CLICKED SONG CURRENTLY PLAYING
   } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
       songItem.innerHTML = playButtonTemplate;
       currentlyPlayingSong = null;
	// IF PLAYING SONG NOT SONG CLICKED
   } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
       var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
       currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
       songItem.innerHTML = pauseButtonTemplate;
       currentlyPlayingSong = songItem.getAttribute('data-song-number');
   }
};

//
// ============================= WINDOW ONLOAD
//
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');
var currentlyPlayingSong = null; // state of playing songs
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

window.onload = function() {
   setCurrentAlbum(albumPicasso);
	
	//
	// ============================= ADD EVENT LISTENERS TO SONG ROWS
	//
				// MOUSEOVER EVENTS
				// ADDED SONGITEM/SONGITEMNUMBER & IF STATEMENTS SO MOUSELEAVE WOULDN'T REVERT PAUSE BUTTON TO PLAY BUTTON
	songListContainer.addEventListener('mouseover', function(event) { 		// what defines "event"?
      var songItem = getSongItem(event.target);
      var songItemNumber = songItem.getAttribute('data-song-number');
      if (event.target.parentElement.className === 'album-view-song-item') {
      	if (songItemNumber !== currentlyPlayingSong) {
				event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
      	} else if (songItemNumber === currentlyPlayingSong) {
				event.target.parentElement.querySelector('.song-item-number').innerHTML = pauseButtonTemplate;
			}
		}
   });
				// MOUSELEAVE EVENTS
   for (var i = 0; i < songRows.length; i++) {
      songRows[i].addEventListener('mouseleave', function(event) {
         var songItem = getSongItem(event.target);
         var songItemNumber = songItem.getAttribute('data-song-number');
         if (songItemNumber !== currentlyPlayingSong) {
             songItem.innerHTML = songItemNumber;
         }
      });
				// CLICK EVENTS
   	songRows[i].addEventListener('click', function(event) {
       	clickHandler(event.target);
   	});
	}
		
	var albums = [albumPicasso, albumMarconi, albumSpring];
	var albumArt = document.getElementsByClassName('album-cover-art')[0];
	var index = 1;
	
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
 };