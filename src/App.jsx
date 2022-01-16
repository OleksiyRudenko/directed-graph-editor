import React, { Component, Fragment } from "react";
import { Editor } from "./components";
import { faGithubSquare } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <div className={`topBar`}>
          <div>
            <div className={`appTitle`}>Graph Editor</div>
            <div>Bugs, issues, appraisals? Please,
              <a
                href={`https://github.com/OleksiyRudenko/directed-graph-editor/issues`}
                target={"_blank"}
              >
                share
                <span className={`externalLinkIcon`}><FontAwesomeIcon icon={faExternalLinkAlt} /></span>
                <FontAwesomeIcon icon={faGithubSquare} />
              </a>
            </div>
          </div>
        </div>
        <main>
          <Editor />
        </main>
      </Fragment>
    );
  }
}
