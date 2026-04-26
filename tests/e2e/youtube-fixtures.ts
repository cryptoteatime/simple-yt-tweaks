import type { Page } from '@playwright/test';

type FixtureName = 'home' | 'search' | 'watch';

const baseStyles = `
  html, body {
    margin: 0;
    min-height: 100%;
    background: #0f0f0f;
    color: #f1f1f1;
    font-family: Arial, sans-serif;
  }

  ytd-app,
  ytd-browse,
  ytd-rich-grid-renderer,
  ytd-rich-item-renderer,
  ytd-rich-shelf-renderer,
  ytd-search,
  ytd-two-column-search-results-renderer,
  ytd-section-list-renderer,
  ytd-item-section-renderer,
  ytd-video-renderer,
  ytd-channel-renderer,
  ytd-watch-flexy,
  ytd-watch-metadata,
  ytd-compact-video-renderer,
  ytd-thumbnail,
  ytd-channel-name,
  yt-lockup-view-model,
  yt-thumbnail-view-model,
  yt-img-shadow {
    display: block;
    box-sizing: border-box;
  }

  [hidden] {
    display: none !important;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img,
  ytd-thumbnail,
  yt-thumbnail-view-model {
    background: #333;
    min-height: 90px;
  }
`;

function pageShell(title: string, body: string): string {
  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>${baseStyles}</style>
      </head>
      <body>${body}</body>
    </html>`;
}

function homeFixture(): string {
  return pageShell(
    'YouTube Fixture Home',
    `
      <ytd-app>
        <ytd-browse page-subtype="home">
          <ytd-rich-grid-renderer>
            <div id="contents">
              <ytd-rich-item-renderer data-testid="video-1" items-per-row="3">
                <a class="ytLockupViewModelContentImage" href="/watch?v=home-1">
                  <yt-thumbnail-view-model></yt-thumbnail-view-model>
                </a>
                <h3>Fixture home video 1</h3>
              </ytd-rich-item-renderer>
              <ytd-rich-item-renderer data-testid="sponsored" items-per-row="3">
                <ad-badge-view-model>Sponsored</ad-badge-view-model>
                <a href="https://googleadservices.com/pagead/aclk">Sponsored card</a>
              </ytd-rich-item-renderer>
              <ytd-rich-item-renderer data-testid="video-2" items-per-row="3">
                <a class="ytLockupViewModelContentImage" href="/watch?v=home-2">
                  <yt-thumbnail-view-model></yt-thumbnail-view-model>
                </a>
                <h3>Fixture home video 2</h3>
              </ytd-rich-item-renderer>
              <ytd-rich-shelf-renderer is-shorts data-testid="shorts-shelf">
                <a href="/shorts/fixture-short">Shorts shelf</a>
              </ytd-rich-shelf-renderer>
              <ytd-rich-item-renderer data-testid="shorts-card" items-per-row="3">
                <a href="/shorts/fixture-short">Shorts card</a>
              </ytd-rich-item-renderer>
              <ytd-rich-item-renderer data-testid="video-3" items-per-row="3">
                <a class="ytLockupViewModelContentImage" href="/watch?v=home-3">
                  <yt-thumbnail-view-model></yt-thumbnail-view-model>
                </a>
                <h3>Fixture home video 3</h3>
              </ytd-rich-item-renderer>
            </div>
          </ytd-rich-grid-renderer>
        </ytd-browse>
      </ytd-app>
    `,
  );
}

function videoRenderer(id: string, title: string, badges = ''): string {
  return `
    <ytd-video-renderer data-testid="${id}">
      <div id="dismissible">
        <ytd-thumbnail>
          <a id="thumbnail" href="/watch?v=${id}">${title}</a>
        </ytd-thumbnail>
        <div id="meta">
          <a id="video-title" href="/watch?v=${id}">${title}</a>
          <div id="channel-info">
            <ytd-channel-name>
              <div id="container">
                <div id="text-container"><span id="text">Fixture Channel</span></div>
              </div>
            </ytd-channel-name>
          </div>
          <ytd-video-meta-block>
            <div id="metadata-line">${badges}</div>
          </ytd-video-meta-block>
          <div id="description-text">Description that should be hidden in compact search cards.</div>
        </div>
      </div>
    </ytd-video-renderer>
  `;
}

function searchFixture(): string {
  return pageShell(
    'YouTube Fixture Search',
    `
      <ytd-app>
        <ytd-search>
          <ytd-two-column-search-results-renderer>
            <div id="primary">
              <ytd-section-list-renderer>
                <div id="contents" class="ytd-section-list-renderer">
                  <ytd-item-section-renderer>
                    <div id="contents">
                      <ytd-channel-renderer data-testid="channel-card">
                        <div id="content-section">
                          <div id="avatar-section"><yt-img-shadow id="avatar"></yt-img-shadow></div>
                          <div id="info-section">
                            <div id="info">
                              <ytd-channel-name id="channel-title">
                                <div id="container"><div id="text-container"><span id="text">Fixture Channel</span></div></div>
                              </ytd-channel-name>
                              <div id="metadata">@fixture • 100K subscribers</div>
                              <div id="description">Fixture channel description.</div>
                            </div>
                          </div>
                        </div>
                      </ytd-channel-renderer>
                      ${videoRenderer(
                        'search-1',
                        'Fixture search video',
                        '<ytd-badge-supported-renderer id="badges"><span>New</span><span>CC</span></ytd-badge-supported-renderer>',
                      )}
                      <grid-shelf-view-model data-testid="shorts-grid">
                        <a href="/shorts/search-short">Shorts shelf</a>
                      </grid-shelf-view-model>
                      <ytd-playlist-renderer data-testid="playlist-result">
                        <a href="/playlist?list=PLfixture">Playlist</a>
                      </ytd-playlist-renderer>
                      ${videoRenderer('search-2', 'Second fixture search video')}
                    </div>
                    <div id="continuations">
                      <ytd-continuation-item-renderer data-testid="continuation">More results</ytd-continuation-item-renderer>
                    </div>
                  </ytd-item-section-renderer>
                </div>
              </ytd-section-list-renderer>
            </div>
          </ytd-two-column-search-results-renderer>
        </ytd-search>
      </ytd-app>
    `,
  );
}

function watchFixture(): string {
  return pageShell(
    'YouTube Fixture Watch',
    `
      <ytd-app>
        <ytd-watch-flexy>
          <div id="columns">
            <div id="primary">
              <div id="primary-inner">
                <div id="player-container-outer">
                  <div id="player-container">
                    <div id="player">
                      <div id="movie_player" class="html5-video-player" style="width: 960px; height: 540px; position: relative;">
                        <div class="html5-video-container" style="width: 100%; height: 100%;">
                          <video class="html5-main-video" style="width: 100%; height: 100%; display: block;"></video>
                        </div>
                        <div class="ytp-chrome-top"></div>
                        <div class="ytp-gradient-top"></div>
                        <div class="ytp-gradient-bottom"></div>
                        <div class="ytp-chrome-bottom" style="position: absolute; left: 0; right: 0; bottom: 0; height: 64px;">
                          <div class="ytp-chrome-controls">
                            <div class="ytp-right-controls"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ytd-watch-metadata>
                  <h1 id="title">Fixture watch video</h1>
                  <div id="top-row">Primary metadata</div>
                  <div id="bottom-row">Secondary metadata</div>
                </ytd-watch-metadata>
                <div id="below">
                  <div id="comments">Fixture comments</div>
                </div>
              </div>
            </div>
            <div id="secondary">
              <div id="related">
                <ytd-compact-video-renderer data-testid="recommended-card">
                  <div id="dismissible">
                    <div id="thumbnail-container">
                      <ytd-thumbnail>
                        <a id="thumbnail" href="/watch?v=recommended-1">Recommended video</a>
                      </ytd-thumbnail>
                    </div>
                    <a href="/watch?v=recommended-1">Recommended title</a>
                  </div>
                </ytd-compact-video-renderer>
              </div>
            </div>
          </div>
        </ytd-watch-flexy>
      </ytd-app>
    `,
  );
}

export async function routeYouTubeFixture(page: Page, fixtureName: FixtureName): Promise<void> {
  await page.route('https://www.youtube.com/**', async (route) => {
    const fixtures: Record<FixtureName, string> = {
      home: homeFixture(),
      search: searchFixture(),
      watch: watchFixture(),
    };

    await route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: fixtures[fixtureName],
    });
  });
}
