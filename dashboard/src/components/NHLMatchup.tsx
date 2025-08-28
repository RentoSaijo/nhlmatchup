"use client";

import React, { useRef, useState, useMemo } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const GAMES = [
    {
        id: "2025020001"
    },
    {
        id: "2025020002"
    },
];

export default function NHLMatchup() {
    const [gameId, setGameId] = useState(GAMES[0]?.id);
    const game = useMemo(
        () => GAMES.find((g) => g.id === gameId) ?? GAMES[0],
        [gameId]
    );

    const nodeRef = useRef<HTMLDivElement | null>(null);

    const onDownload = async () => {
        if (!nodeRef.current) return;

        const dataUrl = await toPng(nodeRef.current, {
            cacheBust: true,
            pixelRatio: 1,
            width: 1080,
            height: 608,
            style: { transform: "none" },
        });

        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `${game.id}.png`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-black p-6">
            {/* Center a 1080px column; place controls ABOVE the outline and centered horizontally */}
            <div className="w-[1080px] mx-auto">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Select defaultValue={GAMES[0].id} onValueChange={(v) => setGameId(v)}>
                        <SelectTrigger className="w-[`120px] border border-[#1EE6FF] rounded-4xl text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {GAMES.map((g) => (
                                    <SelectItem key={g.id} value={g.id} className="font-mono tabular-nums">
                                        {g.id}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Button onClick={onDownload} className="border border-[#1EE6FF] rounded-4xl">
                        <Download className="w-4 h-4" /> Download
                    </Button>
                </div>

                {/* Outline Box (1080x608) */}
                <div
                    ref={nodeRef}
                    className="border border-[#1EE6FF] rounded-4xl bg-[#202A35]"
                    style={{ width: 1080, height: 608 }}
                />
            </div>
        </div>
    );
}
