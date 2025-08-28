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
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const GAME_DATA = [
    {
        id: "COL@FLA-2025-09-09",
        away: { abbr: "COL" },
        home: { abbr: "FLA" },
        dateISO: "2025-09-09",
        startET: "22:00",
    },
];

export default function NHLMatchup() {
    const [gameId, setGameId] = useState(GAME_DATA[0]?.id);
    const game = useMemo(
        () => GAME_DATA.find((g) => g.id === gameId) ?? GAME_DATA[0],
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
        a.download = `${game.away.abbr}@${game.home.abbr}_${game.dateISO}.png`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-black p-6">
            {/* Center a 1080px column; place controls ABOVE the outline and centered horizontally */}
            <div className="w-[1080px] mx-auto">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Select value={gameId} onValueChange={(v) => setGameId(v)}>
                        <SelectTrigger className="w-[160px] border border-[#1EE6FF] rounded-4xl text-white">
                            <SelectValue placeholder="Select Game ID" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Games</SelectLabel>
                                {GAME_DATA.map((g) => (
                                    <SelectItem key={g.id} value={g.id}>
                                        {g.away.abbr} @ {g.home.abbr} — {g.dateISO} {g.startET} ET
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