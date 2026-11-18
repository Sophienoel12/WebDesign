
(function () {

    const all = window.SAMPLE_ACTIVITIES || [];

    // Safely display text

    const label = (value) =>
        String(value ?? "").replace(/[&<>"']/g, ch => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[ch]));


    // Activity card photographs

    function artwork(a) {

        if (a.image) {
            return `
                <div class="card-art photo-art">
                    <img
                        src="${label(a.image)}"
                        alt="${label(a.alt)}"
                        loading="lazy"
                    >
                </div>
            `;
        }

        return `
            <div class="card-art"
                 data-theme="${label(a.theme)}"
                 aria-hidden="true">
                <span>${label(a.icon)}</span>
            </div>
        `;
    }


    // Create activity cards

    function card(a) {

        return `
            <article class="activity-card">

                ${artwork(a)}

                <div class="card-body">

                    <span class="tag">
                        ${label(a.category)}
                    </span>

                    <h3>${label(a.name)}</h3>

                    <p>${label(a.teaser)}</p>

                    <div class="meta">

                        <span class="pill">
                            ${label(a.costLabel)}
                        </span>

                        <span class="pill">
                            Sample listing
                        </span>

                    </div>

                    <a class="card-link"
                       href="activity.html?id=${encodeURIComponent(a.id)}">

                        View activity details →

                    </a>

                </div>

            </article>
        `;

    }


    // Homepage featured activities

    const featured =
        document.getElementById("featured-activities");

    if (featured) {

        const featuredIds = [
            "theater",
            "arcade",
            "skate"
        ];

        featured.innerHTML = featuredIds
            .map(id => all.find(a => a.id === id))
            .filter(Boolean)
            .map(card)
            .join("");

    }


    // Discover page search and filters

    const results =
        document.getElementById("activity-results");

    if (results) {

        const query = document.getElementById("search");
        const interest = document.getElementById("interest");
        const cost = document.getElementById("cost");
        const status = document.getElementById("result-count");

        const preselect =
            new URLSearchParams(window.location.search)
                .get("category");

        if (
            preselect &&
            Array.from(interest.options)
                .some(o => o.value === preselect)
        ) {
            interest.value = preselect;
        }


        function render() {

            const needle =
                query.value.trim().toLowerCase();

            const selected = all.filter(a => {

                const searchableText =
                    `${a.name} ${a.category} ${a.teaser}`
                        .toLowerCase();

                return (
                    (!needle || searchableText.includes(needle)) &&
                    (!interest.value || a.category === interest.value) &&
                    (!cost.value || a.cost === cost.value)
                );

            });

            results.innerHTML = selected.length

                ? selected.map(card).join("")

                : `
                    <div class="empty">

                        <h3>No matching activities yet.</h3>

                        <p>
                            Try clearing a filter or choosing
                            another interest.
                        </p>

                    </div>
                `;

            status.textContent =
                `Showing ${selected.length} of ${all.length} sample activities`;

        }


        ["input", "change"].forEach(event => {

            query.addEventListener(event, render);
            interest.addEventListener(event, render);
            cost.addEventListener(event, render);

        });


        document.getElementById("clear-filters")
            .addEventListener("click", () => {

                query.value = "";
                interest.value = "";
                cost.value = "";

                history.replaceState(
                    null,
                    "",
                    window.location.pathname
                );

                render();
                query.focus();

            });

        render();

    }


    // Individual activity detail pages

    const detail =
        document.getElementById("activity-detail");

    if (detail) {

        const id =
            new URLSearchParams(window.location.search)
                .get("id");

        const a = all.find(item => item.id === id);

        if (!a) {

            detail.innerHTML = `
                <div class="empty">
                    <h1>Activity not found.</h1>
                    <a href="discover.html">
                        Return to Discover
                    </a>
                </div>
            `;

            return;
        }

        document.title =
            `${a.name} | More to Missoula`;


        const detailImage = a.image

            ? `
                <div class="detail-hero-art detail-photo">
                    <img
                        src="${label(a.image)}"
                        alt="${label(a.alt)}"
                    >
                </div>
            `

            : `
                <div class="detail-hero-art"
                     aria-hidden="true">
                    ${label(a.icon)}
                </div>
            `;


        detail.innerHTML = `

            <div class="detail-layout">

                <article>

                    <a class="back-link"
                       href="discover.html">
                        ← Back to Discover
                    </a>

                    ${detailImage}

                    <p class="eyebrow">
                        ${label(a.category)} / Sample activity
                    </p>

                    <h1 style="font-size:clamp(2.5rem,5vw,4.6rem)">
                        ${label(a.name)}
                    </h1>

                    <p class="lead">
                        ${label(a.overview)}
                    </p>

                    <h2 style="font-size:2rem;margin-top:35px">
                        What to expect
                    </h2>

                    <p>${label(a.expect)}</p>

                    <h2 style="font-size:2rem;margin-top:35px">
                        Who might enjoy it?
                    </h2>

                    <p>${label(a.best)}</p>

                    <p class="subtle" style="margin-top:40px">
                        This is an example activity listing.
                        Images are illustrative. Confirm event details
                        with the organizer before attending.
                    </p>

                </article>


                <aside class="detail-panel"
                       aria-label="Activity essentials">

                    <p class="eyebrow">At a glance</p>

                    <dl>

                        <dt>Cost</dt>
                        <dd>${label(a.costLabel)}</dd>

                        <dt>When</dt>
                        <dd>${label(a.when)}</dd>

                        <dt>Where</dt>
                        <dd>${label(a.where)}</dd>

                        <dt>Accessibility</dt>
                        <dd>${label(a.access)}</dd>

                    </dl>

                    <p style="margin-top:25px">

                        <a class="button secondary"
                           href="discover.html">
                            Explore more activities
                        </a>

                    </p>

                </aside>

            </div>

        `;

    }

})();
