<script>
    import {io} from "socket.io-client"
    import Login from "./components/Login.svelte";

    const socket = io("http://localhost:8000/")
</script>

<main>
    {#if !localStorage.getItem("token")}
        <Login {socket}/>
    {/if}
</main>
