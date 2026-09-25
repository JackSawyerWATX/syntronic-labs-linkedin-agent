const pendingContainer = document.querySelector("#pendingPosts");
const approvedContainer = document.querySelector("#approvedPosts");
const rejectedContainer = document.querySelector("#rejectedPosts");
const pendingCount = document.querySelector("#pendingCount");
const refreshButton = document.querySelector("#refreshButton");

async function loadPosts() {
  try {
    const response = await fetch("/api/posts");

    if (!response.ok) {
      throw new Error("Unable to retrieve posts.");
    }

    const posts = await response.json();

    renderPosts(posts);
  } catch (error) {
    console.error(error);

    pendingContainer.innerHTML = "<p>Unable to load posts.</p>";
  }
}

function renderPosts(posts) {
  const pending = posts.filter((post) => post.status === "pending");
  const approved = posts.filter((post) => post.status === "approved");
  const rejected = posts.filter((post) => post.status === "rejected");
  pendingCount.textContent = pending.length;
  renderGroup(pendingContainer, pending, "pending");
  renderGroup(approvedContainer, approved, "approved");
  renderGroup(rejectedContainer, rejected, "rejected");
}

function renderGroup(container, posts, status) {
  container.innerHTML = "";

  if (!posts.length) {
    container.innerHTML = '<p class="empty">No posts.</p>';

    return;
  }

  posts.forEach((post) => {
    container.appendChild(createPostCard(post, status));
  });
}

function createPostCard(post, status) {
  const card = document.createElement("article");

  card.className = "post-card";

  const meta = document.createElement("div");
  meta.className = "post-meta";

  const category = document.createElement("span");
  category.className = "badge";
  category.textContent = post.category || "Uncategorized";

  const statusBadge = document.createElement("span");
  statusBadge.className = "badge";
  statusBadge.textContent = post.status.toUpperCase();

  meta.append(category, statusBadge);

  const topic = document.createElement("h3");
  topic.className = "post-topic";
  topic.textContent = post.topic;

  const content = document.createElement("div");
  content.className = "post-content";
  content.textContent = post.content;

  card.append(meta, topic, content);

  if (status === "pending") {
    const actions = document.createElement("div");

    actions.className = "actions";

    const approveButton = createButton("Approve", "approve-button", () =>
      changePostStatus(post.id, "approve"),
    );

    const rejectButton = createButton("Reject", "reject-button", () =>
      changePostStatus(post.id, "reject"),
    );

    actions.append(approveButton, rejectButton);

    card.appendChild(actions);
  }

  if (status === "rejected") {
    const actions = document.createElement("div");

    actions.className = "actions";

    const regenerateButton = createButton(
      "Regenerate",
      "regenerate-button",
      () => regeneratePost(post.id),
    );

    actions.appendChild(regenerateButton);

    card.appendChild(actions);
  }

  return card;
}

function createButton(text, className, clickHandler) {
  const button = document.createElement("button");

  button.textContent = text;
  button.className = className;

  button.addEventListener("click", clickHandler);

  return button;
}

async function changePostStatus(postId, action) {
  try {
    const response = await fetch(`/api/posts/${postId}/${action}`, {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Request failed.");
    }

    await loadPosts();
  } catch (error) {
    console.error(error);

    alert(error.message);
  }
}

async function regeneratePost(postId) {
  const confirmed = window.confirm(
    "Generate a replacement for this rejected post?",
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`/api/posts/${postId}/regenerate`, {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.error || "Unable to regenerate post.");
    }

    await loadPosts();
  } catch (error) {
    console.error(error);

    alert(error.message);
  }
}

refreshButton.addEventListener("click", loadPosts);

loadPosts();
