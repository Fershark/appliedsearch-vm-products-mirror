import React, {useState, useEffect} from 'react';

const VMDetailPage = ({match}) => {

  const name = match.params.id;//get url params id
  // const article = articles.find(a => a.name === name);

  // //articleInfo is a state with initial value is {upvotes: 0, comments: []}
  // //setArticleInfo is function to change articleInfo state
  // const [articleInfo, setArticleInfo] = useState({upvotes: 0, comments: []});

  // //contain function that be called when component first mounted and component is changed
  // useEffect(() => {
  //   // setArticleInfo({upvotes: 3})
  //   // setArticleInfo({upvotes: Math.ceil(Math.random() * 10)})

  //   //because useEffect cannot define as async
  //   const fetchData = async () => {
  //     const result = await fetch(`/api/articles/${name}`);
  //     const body = await result.json();

  //     setArticleInfo(body)
  //   }

  //   fetchData();
  // //}, []) //[] => ensure run only 1 time when component first mounted, so no update
  // }, [name]) // use name because it change when page load

  // if(!article) return <NotFoundPage />

  // const otherArticles = articles.filter(a => a.name !== name)

  return (
  <React.Fragment>
    <h1>VM Detail</h1>
    {/* <UpvoteSection articleName={name} upvotes={articleInfo.upvotes}  setArticleInfo={setArticleInfo} />
    {article.content.map((p, key) => (
      <p key={key}>{p}</p>
    ))}
    <CommentList comments={articleInfo.comments} />
    <AddCommentForm articleName={name}  setArticleInfo={setArticleInfo} />
    <h3>Other Articles:</h3>
    <ArticleList articles={otherArticles} /> */}
  </React.Fragment>
  );
}

export default VMDetailPage