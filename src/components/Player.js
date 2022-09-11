import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPlay,
	faAngleLeft,
	faAngleRight,
	faPause,
	faVolumeDown,
} from "@fortawesome/free-solid-svg-icons";

//import { playAudio } from "./utils";

const Player = ({
	audioRef,
	currentSong,
	isPlaying,
	setIsPlaying,
	songInfo,
	setSongInfo,
	songs,
	setCurrentSong,
	setSongs,
}) => {
	const [activeVolume, setActiveVolume] = useState(false);

	const activeLibraryHandler = (nextPrev) => {
		const newSongs = songs.map((song) => {
			if (song.id === nextPrev.id) {
				return { ...song, active: true };
			} else {
				return { ...song, active: false };
			}
		});
		setSongs(newSongs);
		if (isPlaying) audioRef.current.play();
		//playAudio(isPlaying, audioRef);
	};

	const playSongHandler = () => {
		if (isPlaying) {
			audioRef.current.pause();
			setIsPlaying(!isPlaying);
		} else {
			audioRef.current.play();
			setIsPlaying(!isPlaying);
		}
	};

	const dragHandler = (e) => {
		audioRef.current.currentTime = e.target.value;
		setSongInfo({ ...songInfo, currentTime: e.target.value });
	};

	const skipTrackHandler = async (direction) => {
		let currentIndex = songs.findIndex(
			(song) => song.id === currentSong.id
		);

		if (direction === "skip-forward") {
			await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
			activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
		}

		if (direction === "skip-back") {
			if ((currentIndex - 1) % songs.length === -1) {
				await setCurrentSong(songs[songs.length - 1]);
				activeLibraryHandler(songs[songs.length - 1]);

				if (isPlaying) audioRef.current.play();

				return;
			}
			await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
			activeLibraryHandler(songs[(currentIndex - 1) % songs.length]);
		}

		if (isPlaying) audioRef.current.play();
	};

	const getTime = (time) => {
		return (
			Math.floor(time / 60) +
			":" +
			("0" + Math.floor(time % 60)).slice(-2)
		);
	};

	// add the styles
	const trackAdmin = {
		transform: `translateX(${songInfo.animationPercentage}%)`,
	};

	//Change volume
	const changeVolume = (e) => {
		let value = e.target.value;
		audioRef.current.volume = value;
		setSongInfo({ ...songInfo, volume: value });
	};

	return (
		<div className="player">
			<div className="time-control">
				<p>{getTime(songInfo.currentTime)}</p>
				<div
					className="track"
					style={{
						background: `linear-gradient(to right, ${currentSong.color[0]},${currentSong.color[1]})`,
					}}
				>
					<input
						min={0}
						max={songInfo.duration || 0}
						value={songInfo.currentTime}
						onChange={dragHandler}
						type="range"
					/>
					<div className="animate-track" style={trackAdmin}></div>
				</div>

				<p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
			</div>
			<div className="play-control">
				<FontAwesomeIcon
					onClick={() => skipTrackHandler("skip-back")}
					className="skip-back"
					size="2x"
					icon={faAngleLeft}
				/>
				<FontAwesomeIcon
					onClick={playSongHandler}
					className="play"
					size="2x"
					icon={isPlaying ? faPause : faPlay}
				/>
				<FontAwesomeIcon
					onClick={() => skipTrackHandler("skip-forward")}
					className="skip-forward"
					size="2x"
					icon={faAngleRight}
				/>
				<FontAwesomeIcon
					onClick={() => setActiveVolume(!activeVolume)}
					icon={faVolumeDown}
				/>
				{activeVolume && (
					<input
						className="volume-track"
						onChange={changeVolume}
						value={songInfo.volume}
						max="1"
						min="0"
						step="0.01"
						type="range"
					/>
				)}
			</div>
		</div>
	);
};

export default Player;
