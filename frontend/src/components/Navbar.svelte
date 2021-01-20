<script>
    import CreateClassroom from "./CreateClassroom.svelte";
    import {type} from "../const"
    import JoinClassroom from "./JoinClassroom.svelte";

    let userType

    type.subscribe(value => userType = value)
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
                    {#if userType === "teacher"}
                        <CreateClassroom/>
                    {:else if userType === "student"}
                        <JoinClassroom/>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</nav>