<script>
    import CreateClassroom from "./CreateClassroom.svelte";
</script>
<nav class="navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <CreateClassroom/>
                </div>
            </div>
        </div>
    </div>
</nav>