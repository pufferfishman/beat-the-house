# beat-the-house
This is a simple Blackjack Basic Strategy trainer tool. It deals out the cards and you can make actions, after each action it will tell you what the correct action was. The text will also become red or green depending on if you did the correct action or not.

The correct actions are based off the basic strategy chart on [wizardofodds.com](https://wizardofodds.com/games/blackjack/strategy/calculator/).
The ruleset of the game is as follows:
Single deck

Dealer hits on soft 17

Double after split allowed

No surrender

The split feature in the trainer is currently not working, but will be implemented very soon.

[Link to project](https://pufferfishman.github.io/beat-the-house/)

<img width="1000" height="800" alt="Screenshot 2025-07-24 192522" src="https://github.com/user-attachments/assets/1e05d971-6bf5-453e-a06d-b1a94c0efd2f" />

## Challenges I Faced
I faced a few challenges in the 15 hours that I spent developing this project.

After my last project, I knew that I couldn't keep biting off more than I could chew. I decided to take on a more simple task, but this blackjack game ended up being almost as complicated as my last project.

There were many bugs I faced along the way, such as blackjacks not working properly, the cards dealing instantly instead of being on an interval, and much more. Luckily, I overcame these bugs and got the game to a fully playable state (apart from splitting, but it's unlikely to be in a situation where you can even split). Overall, the game was a lot more complex than I expected, with many edge cases that I needed to deal with and debug. 

## How I Made It
To make this project, I used basic HTML, CSS, and JavaScript.

At first, I started out with some basic CSS so my eyes wouldn't bleed during the rest of development, and this simple theme stuck throughout the whole time I made it. 

I began with making a single card that had the right dimensions and making sure the rank & suit were in the right places. I decided that making all the suits was too complicated so I made them a solid coloured circle. This does not affect gameplay as suits don't matter in blackjack. Then, I implemented the basic gameplay loop, expanding it to include more features and fixing endless bugs as I went on. I fixed up the CSS to get the cards and buttons in the right places.

If you're not familiar with how to play blackjack, you may want to read through [this](https://bicyclecards.com/how-to-play/blackjack) guide.

In the end, I'm very proud of this project, even if I couldn't get the animations working and the graphics are a bit minimal.

Made with ❤️ by 🐡
