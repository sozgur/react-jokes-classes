import React, { Component } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

// function JokeList({ numJokesToGet = 10 }) {
//   const [jokes, setJokes] = useState([]);

//   /* get jokes if there are no jokes */

//   useEffect(
//     function () {
//       async function getJokes() {
//         let j = [...jokes];
//         let seenJokes = new Set();
//         try {
//           while (j.length < numJokesToGet) {
//             let res = await axios.get("https://icanhazdadjoke.com", {
//               headers: { Accept: "application/json" },
//             });
//             let { status, ...jokeObj } = res.data;

//             if (!seenJokes.has(jokeObj.id)) {
//               seenJokes.add(jokeObj.id);
//               j.push({ ...jokeObj, votes: 0 });
//             } else {
//               console.error("duplicate found!");
//             }
//           }
//           setJokes(j);
//         } catch (e) {
//           console.log(e);
//         }
//       }

//       if (jokes.length === 0) getJokes();
//     },
//     [jokes, numJokesToGet]
//   );

//   /* empty joke list and then call getJokes */

//   function generateNewJokes() {
//     setJokes([]);
//   }

//   /* change vote for this id by delta (+1 or -1) */

//   function vote(id, delta) {
//     setJokes((allJokes) =>
//       allJokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
//     );
//   }

//   /* render: either loading spinner or list of sorted jokes. */

//   if (jokes.length) {
//     let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

//     return (
//       <div className="JokeList">
//         <button className="JokeList-getmore" onClick={generateNewJokes}>
//           Get New Jokes
//         </button>

//         {sortedJokes.map((j) => (
//           <Joke
//             text={j.joke}
//             key={j.id}
//             id={j.id}
//             votes={j.votes}
//             vote={vote}
//           />
//         ))}
//       </div>
//     );
//   }

//   return null;
// }

class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10,
  };

  constructor(props) {
    super(props);
    this.state = {
      jokes: [],
    };

    this.vote = this.vote.bind(this);
    this.generateNewJokes = this.generateNewJokes.bind(this);
  }

  async componentDidMount() {
    if (this.state.jokes.length < this.props.numJokesToGet) {
      await this.getJokes();
    }
  }

  async componentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokesToGet) {
      await this.getJokes();
    }
  }

  async getJokes() {
    try {
      let j = this.state.jokes;
      let seenJokes = new Set();

      while (j.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({ jokes: j });
    } catch (e) {
      console.log(e);
    }
  }

  vote(id, delta) {
    const jokeWithVotes = this.state.jokes.map((j) =>
      j.id === id ? { ...j, votes: j.votes + delta } : j
    );

    this.setState({ jokes: jokeWithVotes });
  }

  generateNewJokes() {
    this.setState({ jokes: [] });
  }

  render() {
    if (this.state.jokes.length) {
      let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);

      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>

          {sortedJokes.map((j) => (
            <Joke
              text={j.joke}
              key={j.id}
              id={j.id}
              votes={j.votes}
              vote={this.vote}
            />
          ))}
        </div>
      );
    }

    return null;
  }
}

export default JokeList;
