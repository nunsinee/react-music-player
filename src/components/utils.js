export const playAudio = (isPlaying, audioRef) => {
	if (isPlaying) {
		const playPromise = audioRef.current.play();
		if (playPromise !== null) {
			playPromise
				.then(() => {
					audioRef.current.play();
				})
				.catch(() => audioRef.current.play());
		}
	}
};

// Can use this function below too

//export const playAudio = (isPlaying, audioRef) => {
// 	if (isPlaying) {
// 		const playPromise = audioRef.current.play();
// 		if (playPromise !== undefined) {
// 			playPromise.then(() => audioRef.current.play());
// 		}
// 	}
// };
