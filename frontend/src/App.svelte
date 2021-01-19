<script>
    import Login from "./components/Login.svelte";
    import CreateClassroom from "./components/CreateClassroom.svelte";
    import Navbar from "./components/Navbar.svelte";
    import Classrooms from "./components/Classrooms.svelte";
</script>

<main>
    {#if !localStorage.getItem("token")}
        <Login/>
    {:else}
        <Navbar/>
        <Classrooms/>
    {/if}
</main>
