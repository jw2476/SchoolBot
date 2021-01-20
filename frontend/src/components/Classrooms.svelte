<section class="section">
    {#if !selectedClassroom}
        <div class="columns">
            {#each classrooms as classroom}
                <div class="column is-one-third">
                    <article class="message is-primary">
                        <div class="message-header">
                            <p>{classroom.code}</p>
                            {#if userType === "teacher"}
                                <DeleteClassroom classroom={classroom}/>
                            {/if}
                        </div>
                        <div class="message-body has-text-centered">
                            <button class="button is-primary" on:click={() => selectedClassroom=classroom}>Enter
                            </button>
                        </div>
                    </article>
                </div>
            {/each}
        </div>
    {:else}
        <Classroom classroom={selectedClassroom}/>
    {/if}
    {#if error}
        <div class="container has-text-centered">
            <h1 class="title is-danger">An error occurred when trying to get your classrooms, please reload</h1>
        </div>
    {/if}
</section>


<script>
    import axios from "axios"
    import {onMount} from "svelte";
    import Classroom from "./Classroom.svelte";
    import {type} from "../stores";
    import DeleteClassroom from "./DeleteClassroom.svelte";

    let error, selectedClassroom
    let classrooms = []
    let userType

    type.subscribe(value => userType = value)

    onMount(async () => {
        classrooms = await axios.get(`http://localhost:8000/api/${userType}s/${localStorage.getItem("id")}/classrooms`).then(res => res.data).catch(err => {
            console.error(err);
            return []
        })

        if (!classrooms || classrooms.error) {
            error = true
            classrooms = []
        } else {
            console.log(classrooms)
        }
    })
</script>

<style>
    #classroom {
        margin-left: 16px;
        margin-bottom: 0;
    }
</style>