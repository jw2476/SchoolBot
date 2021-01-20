<script>
    import Login from "./components/Login.svelte";
    import Navbar from "./components/Navbar.svelte";
    import Classrooms from "./components/Classrooms.svelte";
    import {type} from "./stores";
    import axios from "axios";

    const id = localStorage.getItem("id")
    axios.get(`http://localhost:8000/api/${id}/type`).then(res => type.set(res.data)).catch(console.error)

    let userType

    type.subscribe(value => userType = value)

</script>

<main>
    {#if !localStorage.getItem("token")}
        <Login/>
    {:else if userType}
        <Navbar/>
        <Classrooms/>
    {:else}
        <section class="section">
            <div class="has-text-centered container">
                <h1 class="title is-danger">Could not find your user data, please leave and rejoin the discord server to
                    generate it!</h1>
            </div>
        </section>
    {/if}
</main>
