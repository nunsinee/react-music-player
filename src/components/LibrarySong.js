import React from "react";

const LibrarySong = ({
	song,
	songs,
	setCurrentSong,
	id,
	setSongs,
	active,
	audioRef,
	isPlaying,
}) => {
	const songSelectHandler = async () => {
		const selectedSong = songs.filter((state) => state.id === id);
		await setCurrentSong(selectedSong[0]);

		// it also can use this...
		//await setCurrentSong({ ...selectedSong[0] });
		//... instead of...await setCurrentSong(selectedSong[0]);

		//Add active state
		const newSongs = songs.map((song) => {
			if (song.id === id) {
				return { ...song, active: true };
			} else {
				return { ...song, active: false };
			}
		});

		setSongs(newSongs);

		//check if the song is isPlaying
		if (isPlaying) audioRef.current.play();
	};
	return (
		<div
			className={`library-song ${song.active ? "selected" : ""} `}
			onClick={songSelectHandler}
		>
			<img alt={song.name} src={song.cover} />
			<div className="song-description">
				<h3>{song.name}</h3>
				<h4>{song.artist}</h4>
			</div>
		</div>
	);
};

export default LibrarySong;
