import React, { useState, useRef } from "react";

import Player from "./components/Player";
import Song from "./components/Song";
import "./styles/app.scss";
import data from "./data";

import Library from "./components/Library";
import Nav from "./components/Nav";

import { playAudio } from "./components/utils";

function App() {
	const [songs, setSongs] = useState(data());
	const [currentSong, setCurrentSong] = useState(songs[0]);
	const [isPlaying, setIsPlaying] = useState(false);

	//Ref
	const audioRef = useRef(null);

	// Move from Player
	const [songInfo, setSongInfo] = useState({
		currentTime: 0,
		duration: 0,
		animationPercentage: 0,
		volume: 0, //just add
	});

	//nav

	const [libraryStatus, setLibraryStatus] = useState(false);

	//Move from Player
	const timeUpdateHandler = (e) => {
		const current = e.target.currentTime;
		const duration = e.target.duration;
		//calculate percentage of duration
		const roundedCurrent = Math.round(current);
		const roundedDuration = Math.round(duration);
		const animation = Math.round((roundedCurrent / roundedDuration) * 100);

		setSongInfo({
			...songInfo,
			currentTime: current,
			duration,
			animationPercentage: animation,
			volume: e.target.volume, // just add
		});
	};

	////////////////////////////////
	// sove proplem to update active in Library on autoPlay
	const activeLibraryHandler = (nextPrev) => {
		const newSongs = songs.map((song) => {
			if (song.id === nextPrev.id) {
				return { ...song, active: true };
			} else {
				return { ...song, active: false };
			}
		});
		setSongs(newSongs);
		playAudio(isPlaying, audioRef);
	};
	////////////////////////////////

	const songEndHandler = async () => {
		let currentIndex = songs.findIndex(
			(song) => song.id === currentSong.id
		);
		await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
		await activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
		playAudio(isPlaying, audioRef);
	};

	return (
		<div className={`App ${libraryStatus ? "library-active" : ""}`}>
			<Nav
				libraryStatus={libraryStatus}
				setLibraryStatus={setLibraryStatus}
			/>
			<Song isPlaying={isPlaying} currentSong={currentSong} />
			<Player
				audioRef={audioRef}
				currentSong={currentSong}
				isPlaying={isPlaying}
				setIsPlaying={setIsPlaying}
				setSongInfo={setSongInfo}
				songInfo={songInfo}
				songs={songs}
				setCurrentSong={setCurrentSong}
				setSongs={setSongs}
			/>
			<Library
				songs={songs}
				setCurrentSong={setCurrentSong}
				audioRef={audioRef}
				isPlaying={isPlaying}
				setSongs={setSongs}
				libraryStatus={libraryStatus}
			/>
			<audio
				ref={audioRef}
				src={currentSong.audio}
				onTimeUpdate={timeUpdateHandler}
				onLoadedMetadata={timeUpdateHandler}
				onEnded={songEndHandler}
			></audio>
		</div>
	);
}

export default App;
