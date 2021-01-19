<script>
    import Login from "./components/Login.svelte";
    import CreateClassroom from "./components/CreateClassroom.svelte";
    import Navbar from "./components/Navbar.svelte";
</script>

<main>
    {#if !localStorage.getItem("token")}
        <Login/>
    {:else}
        <Navbar/>
    {/if}
</main>
