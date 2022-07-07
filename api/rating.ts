import fetch from 'node-fetch';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import parse from 'node-html-parser';

const logo =
    'data:image/png;base64,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';

interface UserRatingInfo {
    rating: number;
    text: string;
}

function escape(username: string) {
    return encodeURIComponent(username.replace(/-/g, '--').replace(/_/g, '__'));
}

function getRatingColor(rating: number) {
    if (rating >= 2800) return 'FF0000';
    if (rating >= 2400) return 'FF8000';
    if (rating >= 2000) return 'C0C000';
    if (rating >= 1600) return '0000FF';
    if (rating >= 1200) return '00C0C0';
    if (rating >= 800) return '008000';
    if (rating >= 400) return '804000';
    return '808080';
}

async function fetchData(username: string, type: string): Promise<UserRatingInfo> {
    const res = await fetch(`https://atcoder.jp/users/${username}?contestType=${type}`);
    const html = await res.text();
    const document = parse(html);
    const container = document.querySelector('#main-container');

    if (!res.ok || !container) return { rating: 0, text: 'N/A' };

    const ratingEl = container.querySelector(
        '#user-nav-tabs + table > tr:nth-child(2) > td:nth-child(2) > span:first-child'
    );
    const textEl = document.querySelector('div.row > div.col-md-3.col-sm-12 > h3 > b');

    if (!ratingEl) return { rating: 0, text: 'Unrated' };

    const rating = Number(ratingEl.innerText.trim());
    const text = textEl?.innerText.trim() || 'N/A';

    return { rating, text };
}

async function getBadgeImage(username: string | null, data: UserRatingInfo, style: string) {
    const color = getRatingColor(data.rating);
    const escapedUsername = escape(username || 'baoshuo');
    const escapedRating = escape(data.rating.toString());
    const escapedRatingText = escape(data.text);

    const params = new URLSearchParams({
        longCache: 'true',
        style,
        logo: encodeURIComponent(logo),
        link: `https://atcoder.jp/users/${username}`,
    });

    try {
        const res = await fetch(
            `https://img.shields.io/badge/${escapedUsername}-${escapedRatingText}  ${escapedRating}-${color}.svg?${params.toString()}`
        );

        if (!res.ok) return 'error';
        return await res.text();
    } catch (e) {
        return 'error';
    }
}

export default async (request: VercelRequest, response: VercelResponse) => {
    let { username = 'baoshuo', type = 'algo', style = 'for-the-badge' } = request.query;

    if (Array.isArray(username)) username = username[0];
    if (Array.isArray(type)) type = type[0];
    if (Array.isArray(style)) style = style[0];

    const data = await fetchData(username as string, type as string).catch(() => ({ rating: 0, text: 'N/A' }));
    getBadgeImage(username as string, data, style as string)
        .then((data) => {
            response.status(200).setHeader('Content-Type', 'image/svg+xml;charset=utf-8').send(data);
        })
        .catch(() => {
            response.status(500).send('error');
        });
};
