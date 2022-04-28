---
layout: post
title: Caching dockerfiles
---

!!! tldr
    Sample Github actions pipeline:

    <div id="termynal1" data-termynal >
      <span data-ty="input">curl -L git.io/netsurf | python3</span>
      <span data-ty="input">netsurf -w 1920 -h 1080 google.com/search?q="terry tao"</span>
    </div>
    steps:
      - name: Repo Checkout
        uses: actions/checkout@v2
      - name: Setup envs
        run: |
          cp .env.dist .env
      - name: Set up Docker Buildx
        id: buildx
        uses: docker/setup-buildx-action@master
      - name: Cache Docker layers
        uses: actions/cache@v2
        with:
          path: /tmp/.buildx-cache
          key: ${{ runner.os }}-buildx-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-buildx-
      - name: Build docker images with buildx bake
        id: docker-compose-build
        run: |
          echo "exporting" \
            && set -a \
            && . .env \
            && set +a \
            && printenv \
          && echo "Running buildx..." \
            && docker buildx bake \
              -f docker-compose.yml \
              --set=*.cache-from=type=local,src=/tmp/.buildx-cache \
              --set=*.cache-to=type=local,dest=/tmp/.buildx-cache-new
        env:
          DOCKER_BUILDKIT: 1
          BUILDKIT_PROGRESS: plain
      - name: Move cache
        run: |
          rm -rf /tmp/.buildx-cache
          mv /tmp/.buildx-cache-new /tmp/.buildx-cache



## Why
