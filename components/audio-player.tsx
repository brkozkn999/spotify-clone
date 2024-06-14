import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, VolumeX, Volume1 } from 'lucide-react';
import Image from 'next/image';
import { Slider } from './ui/slider';
import { AspectRatio } from './ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useTheme } from 'next-themes';

interface AudioPlayerProps {
    id: Id<"files">;
    songUrl: string;
    title: string;
    artist: string;
    coverArt: string | null;
    handleNext: () => void;
    handlePrevious: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ id, songUrl, title, artist, coverArt, handleNext, handlePrevious }) => {
    const { theme, setTheme } = useTheme();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    const isFavorite = useQuery(api.files.getFavorite, { id });
    const favorite = useMutation(api.files.favorite);
    const unfavorite = useMutation(api.files.unfavorite);

    useEffect(() => {
        setIsPlaying(false);
        setCurrentTime(0);
    }, [songUrl]);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (audio) {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration);
        }
    };

    const handleVolumeChange = (value: number[]) => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = value[0];
            setVolume(audio.volume);
        }
    };

    const handleSeek = (value: number[]) => {
        const audio = audioRef.current;
        if (audio) {
            const newTime = value[0];
            if (isFinite(newTime)) {
                audio.currentTime = newTime;
                setCurrentTime(newTime);
            }
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleFavorite = () => {
        if (isFavorite)
            unfavorite({ id });
        else
            favorite({ id });
    }

    return (
        <div className={cn("fixed bottom-0 left-0 right-0 shadow-lg py-4 px-6 flex justify-start gap-y-4 items-center",
            theme === 'dark' ? 'bg-gray-800' : 'bg-white')}>
            <div className="flex items-center w-64 justify-between">
                {coverArt && (
                    <div className="w-16 h-16 rounded-md mr-4">
                        <AspectRatio ratio={1 / 1}>
                            <Image
                                src={coverArt}
                                alt={title}
                                fill
                                objectFit="cover"
                                className='rounded-md'
                            />
                        </AspectRatio>
                    </div>
                )}
                <div>
                    <h2 className={cn("font-semibold", theme === 'dark' ? 'text-white' : 'text-black')}>{title}</h2>
                    <p className={cn(theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>{artist}</p>
                </div>
                <button
                    onClick={handleFavorite}
                    className="transform transition hover:scale-125 active:scale-150 mr-20">
                    <Heart
                        size={20}
                        className={cn(
                            theme === 'dark' ? "text-white" : "text-black",
                            isFavorite && "text-red-600 fill-red-600"
                        )}
                    />
                </button>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <button className={cn("rounded-full p-2 mr-2", theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300')} onClick={handlePrevious}>
                    <SkipBack size={20} className={cn(theme === 'dark' ? 'text-white' : 'text-black')} />
                </button>
                <button className={cn("rounded-full p-3 mr-2", theme === 'dark' ? 'bg-primary' : 'bg-secondary')} onClick={togglePlayPause}>
                    {isPlaying ?
                        <Pause size={24} className={cn(theme === 'dark' ? 'text-white' : 'text-black')} />
                        : <Play size={24} className={cn(theme === 'dark' ? 'text-white' : 'text-black')} />
                    }
                </button>
                <button className={cn("rounded-full p-2", theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300')} onClick={handleNext} >
                    <SkipForward size={20} className={cn(theme === 'dark' ? 'text-white' : 'text-black')} />
                </button>
            </div>
            <div className="flex items-center lg:space-x-14">
                <div className="flex items-center justify-center lg:space-x-4 w-[450px]">
                    <Slider
                        defaultValue={[currentTime]}
                        max={duration}
                        step={0.01}
                        value={[currentTime]}
                        onValueChange={handleSeek}
                        className={cn("w-48 lg:w-80", theme === 'dark' ? 'text-white' : 'text-black')}
                    />
                    <div className={cn("mr-4", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                        {formatTime(currentTime)} {isFinite(duration) ? `/ ${formatTime(duration)}` : ''}
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <Slider
                        defaultValue={[volume]}
                        max={1}
                        step={0.01}
                        value={[volume]}
                        onValueChange={handleVolumeChange}
                        className="w-28"/>
                        {volume === 0 ? (
                            <VolumeX size={20} className={cn(theme === 'dark' ? 'text-gray-400' : 'text-gray-600')} />
                            ) : volume > 0 && volume <= 0.7 ? (
                            <Volume1 size={20} className={cn(theme === 'dark' ? 'text-gray-400' : 'text-gray-600')} />
                            ) : (
                            <Volume2 size={20} className={cn(theme === 'dark' ? 'text-gray-400' : 'text-gray-600')} />
                        )}
                </div>
            </div>
            <audio ref={audioRef} src={songUrl} onTimeUpdate={handleTimeUpdate} />
        </div>
    );
};

export default AudioPlayer;
