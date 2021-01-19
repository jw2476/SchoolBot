<script>
    import Login from "./components/Login.svelte";
    import Navbar from "./components/Navbar.svelte";
    import Classrooms from "./components/Classrooms.svelte";
    import {type} from "./stores";
    import axios from "axios";

    const id = localStorage.getItem("id")
    axios.get(`http://localhost:8000/api/${id}/type`).then(res => type.set(res.data)).catch(console.error)

</script>

<main>
    {#if !localStorage.getItem("token")}
        <Login/>
    {:else}
        <Navbar/>
        <Classrooms/>
    {/if}
</main>
