import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    line-height: 1.5;
  }

  body {
    font-family: Asap, 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: Asap, 'Roboto', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    /*background-color: #fafafa;*/
    min-height: 100%;
    min-width: 100%;
  }
/*
  p,
  label {
    font-family: Asap, 'Roboto', Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
  */
  
.docMarkdown {
  font-family: Helvetica, arial, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: white;
  padding: 30px;
  color: #333;
}
.docMarkdown p {
  font-family: Helvetica, arial, sans-serif;
  font-size: 14px;
  line-height: 1.6;
}

.docMarkdown  > *:first-child {
  margin-top: 0 !important;
}

.docMarkdown  > *:last-child {
  margin-bottom: 0 !important;
}

.docMarkdown a {
  color: #4183C4;
  text-decoration: none;
}

.docMarkdown a.absent {
  color: #cc0000;
}

.docMarkdown a.anchor {
  display: block;
  padding-left: 30px;
  margin-left: -30px;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
}

.docMarkdown h1, .docMarkdown .docMarkdown h2, .docMarkdown .docMarkdown h3, .docMarkdown .docMarkdown h4, .docMarkdown .docMarkdown h5, .docMarkdown .docMarkdown h6 {
  margin: 20px 0 10px;
  padding: 0;
  font-weight: bold;
  -webkit-font-smoothing: antialiased;
  cursor: text;
  position: relative;
}

.docMarkdown h2:first-child, .docMarkdown .docMarkdown h1:first-child, .docMarkdown h1:first-child + h2, .docMarkdown .docMarkdown h3:first-child, .docMarkdown .docMarkdown h4:first-child, .docMarkdown .docMarkdown h5:first-child, .docMarkdown .docMarkdown h6:first-child {
  margin-top: 0;
  padding-top: 0;
}

.docMarkdown h1:hover a.anchor, .docMarkdown .docMarkdown h2:hover a.anchor, .docMarkdown .docMarkdown h3:hover a.anchor, .docMarkdown .docMarkdown h4:hover a.anchor, .docMarkdown .docMarkdown h5:hover a.anchor, .docMarkdown .docMarkdown h6:hover a.anchor {
  text-decoration: none;
}

.docMarkdown h1 tt, .docMarkdown .docMarkdown h1 code {
  font-size: inherit;
}

.docMarkdown h2 tt, .docMarkdown .docMarkdown h2 code {
  font-size: inherit;
}

.docMarkdown h3 tt, .docMarkdown .docMarkdown h3 code {
  font-size: inherit;
}

.docMarkdown h4 tt, .docMarkdown .docMarkdown h4 code {
  font-size: inherit;
}

.docMarkdown h5 tt, .docMarkdown .docMarkdown h5 code {
  font-size: inherit;
}

.docMarkdown h6 tt, .docMarkdown .docMarkdown h6 code {
  font-size: inherit;
}

.docMarkdown h1 {
  font-size: 32px;
  color: black;
}

.docMarkdown h2 {
  font-size: 24px;
  border-bottom: 1px solid #cccccc;
  color: black;
}

.docMarkdown h3 {
  font-size: 18px;
  color: #ed1951;
  margin-top: 30px;
}

.docMarkdown h4 {
  font-size: 16px;
}

.docMarkdown  h5 {
  font-size: 14px;
}

.docMarkdown h6 {
  color: #777777;
  font-size: 14px;
}

p, .docMarkdown blockquote, .docMarkdown ul, .docMarkdown ol, .docMarkdown dl, .docMarkdown li, .docMarkdown table, .docMarkdown pre {
  margin: 15px 0;
}

.docMarkdown hr {
  border: 0 none;
  color: #cccccc;
  height: 4px;
  padding: 0;
}

.docMarkdown body > h2:first-child {
  margin-top: 0;
  padding-top: 0;
}

.docMarkdown body > h1:first-child {
  margin-top: 0;
  padding-top: 0;
}

.docMarkdown body > h1:first-child + h2 {
  margin-top: 0;
  padding-top: 0;
}

.docMarkdown body > h3:first-child, .docMarkdown body > h4:first-child, .docMarkdown body > h5:first-child, .docMarkdown body > h6:first-child {
  margin-top: 0;
  padding-top: 0;
}

.docMarkdown a:first-child h1, .docMarkdown a:first-child h2, .docMarkdown a:first-child h3, .docMarkdown a:first-child h4, .docMarkdown a:first-child h5, .docMarkdown a:first-child h6 {
  margin-top: 0;
  padding-top: 0;
}

.docMarkdown h1 p, .docMarkdown h2 p, .docMarkdown h3 p, .docMarkdown h4 p, .docMarkdown h5 p, .docMarkdown h6 p {
  margin-top: 0;
}

.docMarkdown li p.first {
  display: inline-block;
}

.docMarkdown ul, .docMarkdown ol {
  padding-left: 30px;
}

.docMarkdown ul :first-child, .docMarkdown ol :first-child {
  margin-top: 0;
}

.docMarkdown ul :last-child, .docMarkdown ol :last-child {
  margin-bottom: 0;
}

.docMarkdown dl {
  padding: 0;
}

.docMarkdown dl dt {
  font-size: 14px;
  font-weight: bold;
  font-style: italic;
  padding: 0;
  margin: 15px 0 5px;
}

.docMarkdown dl dt:first-child {
  padding: 0;
}

.docMarkdown dl dt > :first-child {
  margin-top: 0;
}

.docMarkdown dl dt > :last-child {
  margin-bottom: 0;
}

.docMarkdown dl dd {
  margin: 0 0 15px;
  padding: 0 15px;
}

.docMarkdown dl dd > :first-child {
  margin-top: 0;
}

.docMarkdown dl dd > :last-child {
  margin-bottom: 0;
}

.docMarkdown blockquote {
  border-left: 4px solid #dddddd;
  padding: 0 15px;
  color: #777777;
}

.docMarkdown blockquote > :first-child {
  margin-top: 0;
}

.docMarkdown blockquote > :last-child {
  margin-bottom: 0;
}

.docMarkdown table {
  padding: 0;
}
.docMarkdown table tr {
  border-top: 1px solid #cccccc;
  background-color: white;
  margin: 0;
  padding: 0;
}

.docMarkdown table tr:nth-child(2n) {
  background-color: #f8f8f8;
}

.docMarkdown table tr th {
  font-weight: bold;
  border: 1px solid #cccccc;
  text-align: left;
  margin: 0;
  padding: 6px 13px;
}

.docMarkdown table tr td {
  border: 1px solid #cccccc;
  text-align: left;
  margin: 0;
  padding: 6px 13px;
}

.docMarkdown table tr th :first-child, .docMarkdown table tr td :first-child {
  margin-top: 0;
}

.docMarkdown table tr th :last-child, .docMarkdown table tr td :last-child {
  margin-bottom: 0;
}

.docMarkdown img {
  max-width: 100%;
}

.docMarkdown span.frame {
  display: block;
  overflow: hidden;
}

.docMarkdown span.frame > span {
  border: 1px solid #dddddd;
  display: block;
  float: left;
  overflow: hidden;
  margin: 13px 0 0;
  padding: 7px;
  width: auto;
}

.docMarkdown span.frame span img {
  display: block;
  float: left;
}

.docMarkdown span.frame span span {
  clear: both;
  color: #333333;
  display: block;
  padding: 5px 0 0;
}

.docMarkdown span.align-center {
  display: block;
  overflow: hidden;
  clear: both;
}

.docMarkdown span.align-center > span {
  display: block;
  overflow: hidden;
  margin: 13px auto 0;
  text-align: center;
}

.docMarkdown span.align-center span img {
  margin: 0 auto;
  text-align: center;
}

.docMarkdown span.align-right {
  display: block;
  overflow: hidden;
  clear: both;
}

.docMarkdown span.align-right > span {
  display: block;
  overflow: hidden;
  margin: 13px 0 0;
  text-align: right;
}

.docMarkdown span.align-right span img {
  margin: 0;
  text-align: right;
}

.docMarkdown span.float-left {
  display: block;
  margin-right: 13px;
  overflow: hidden;
  float: left;
}

.docMarkdown span.float-left span {
  margin: 13px 0 0;
}

.docMarkdown span.float-right {
  display: block;
  margin-left: 13px;
  overflow: hidden;
  float: right;
}

.docMarkdown span.float-right > span {
  display: block;
  overflow: hidden;
  margin: 13px auto 0;
  text-align: right;
}

.docMarkdown code, .docMarkdown tt {
  margin: 0 2px;
  padding: 0 5px;
  white-space: nowrap;
  border: 1px solid #eaeaea;
  background-color: #f9f2f4;
  border-radius: 3px;
}

.docMarkdown pre code {
  margin: 0;
  padding: 0;
  white-space: pre;
  border: none;
  background: transparent;
}

.docMarkdown .highlight pre {
  background-color: #f8f8f8;
  border: 1px solid #cccccc;
  font-size: 13px;
  line-height: 19px;
  overflow: auto;
  padding: 6px 10px;
  border-radius: 3px;
}

.docMarkdown pre {
  background-color: #f8f8f8;
  border: 1px solid #cccccc;
  font-size: 13px;
  line-height: 19px;
  overflow: auto;
  padding: 6px 10px;
  border-radius: 3px;
}

.docMarkdown pre code, .docMarkdown pre tt {
  background-color: transparent;
  border: none;
}
`;
export default GlobalStyle;
